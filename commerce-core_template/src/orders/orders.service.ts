import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppType, OrderStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async checkout(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },

      include: {
        product: true,
      },
    });

    if (!cartItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmount = 0;

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `${item.product.name} stock is insufficient`,
        );
      }

      totalAmount += Number(item.product.price) * item.quantity;
    }

    const orderNumber = `KB-${Date.now()}`;

    const result = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const order = await tx.order.create({
          data: {
            userId,
            orderNumber,
            totalAmount,
            status: OrderStatus.PENDING,
          },
        });

        for (const item of cartItems) {
          const price = Number(item.product.price);

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              productName: item.product.name,
              price,
              quantity: item.quantity,
              subtotal: price * item.quantity,
            },
          });

          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: OrderStatus.PENDING,
            notes: 'Order created',
          },
        });

        await tx.cartItem.deleteMany({
          where: {
            userId,

            product: {
              appType: AppType.COFFEE,
            },
          },
        });

        await this.auditLogsService.create({
          userId,
          action: 'CHECKOUT',
          entity: 'Order',
          entityId: order.id.toString(),
          newData: order,
        });

        return order;
      },
    );

    return {
      message: 'Checkout successful',
      data: result,
    };
  }

  async findAll(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,

        items: {
          some: {
            product: {
              appType: AppType.COFFEE,
            },
          },
        },
      },

      include: {
        items: true,
        payments: true,
        histories: true,
      },

      orderBy: {
        id: 'desc',
      },
    });

    return {
      data: orders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
      })),
    };
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        userId,

        items: {
          some: {
            product: {
              appType: AppType.COFFEE,
            },
          },
        },
      },

      include: {
        items: true,
        payments: true,
        histories: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      data: {
        ...order,
        totalAmount: Number(order.totalAmount),
      },
    };
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,

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

    const updatedOrder = await this.prisma.order.update({
      where: {
        id,
      },

      data: {
        status: dto.status,
      },
    });

    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: dto.status,
        notes: dto.notes,
      },
    });

    await this.auditLogsService.create({
      userId: order.userId,
      action: 'UPDATE_ORDER_STATUS',
      entity: 'Order',
      entityId: id.toString(),
      newData: {
        status: dto.status,
        notes: dto.notes,
      },
    });

    return {
      message: 'Order status updated successfully',

      data: {
        ...updatedOrder,

        totalAmount: Number(updatedOrder.totalAmount),
      },
    };
  }
}
