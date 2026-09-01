import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppType, OrderStatus, PaymentStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(userId: number, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        userId,

        items: {
          some: {
            product: {
              appType: AppType.COFFEE,
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        orderId: dto.orderId,

        order: {
          items: {
            some: {
              product: {
                appType: AppType.COFFEE,
              },
            },
          },
        },
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: order.totalAmount,
        method: dto.method,
      },

      include: {
        order: true,
      },
    });

    await this.auditLogsService.create({
      userId: payment.order.userId,
      action: 'CREATE_PAYMENT',
      entity: 'Payment',
      entityId: payment.id.toString(),
      newData: payment,
    });

    return {
      message: 'Payment created successfully',
      data: {
        ...payment,
        amount: Number(payment.amount),
      },
    };
  }

  async findAll(userId: number) {
    const payments = await this.prisma.payment.findMany({
      where: {
        order: {
          userId,

          items: {
            some: {
              product: {
                appType: AppType.COFFEE,
              },
            },
          },
        },
      },

      include: {
        order: true,
      },

      orderBy: {
        id: 'desc',
      },
    });

    return {
      data: payments.map((payment) => ({
        ...payment,

        amount: Number(payment.amount),
      })),
    };
  }

  async findOne(id: number, userId: number) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,

        order: {
          userId,

          items: {
            some: {
              product: {
                appType: AppType.COFFEE,
              },
            },
          },
        },
      },

      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      data: {
        ...payment,

        amount: Number(payment.amount),
      },
    };
  }

  async updateStatus(id: number, dto: UpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,

        order: {
          items: {
            some: {
              product: {
                appType: AppType.COFFEE,
              },
            },
          },
        },
      },

      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: {
        id,
      },

      data: {
        status: dto.status,
        paidAt: dto.status === PaymentStatus.SUCCESS ? new Date() : null,
      },

      include: {
        order: true,
      },
    });

    if (dto.status === PaymentStatus.SUCCESS) {
      await this.prisma.order.update({
        where: {
          id: payment.orderId,
        },

        data: {
          status: OrderStatus.PAID,
        },
      });

      await this.prisma.orderStatusHistory.create({
        data: {
          orderId: payment.orderId,
          status: OrderStatus.PAID,
          notes: 'Payment successful',
        },
      });

      await this.auditLogsService.create({
        userId: payment.order.userId,
        action: 'PAYMENT_SUCCESS',
        entity: 'Payment',
        entityId: payment.id.toString(),
        newData: updatedPayment,
      });
    }

    if (dto.status === PaymentStatus.FAILED) {
      await this.auditLogsService.create({
        userId: payment.order.userId,
        action: 'PAYMENT_FAILED',
        entity: 'Payment',
        entityId: payment.id.toString(),
        newData: updatedPayment,
      });
    }

    return {
      message: 'Payment status updated successfully',

      data: {
        ...updatedPayment,

        amount: Number(updatedPayment.amount),
      },
    };
  }
}
