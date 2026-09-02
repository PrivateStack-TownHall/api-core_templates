import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferStatusDto } from './dto/update-transfer-status.dto';

@Injectable()
export class TransfersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    fromWarehouse: true,
    toWarehouse: true,
    items: { include: { product: true } },
  };

  async create(dto: CreateTransferDto) {
    if (dto.fromWarehouseId === dto.toWarehouseId) {
      throw new BadRequestException(
        'fromWarehouseId and toWarehouseId cannot be the same',
      );
    }

    const existing = await this.prisma.transfer.findUnique({
      where: { code: dto.code },
    });
    if (existing) throw new ConflictException('Transfer code already exists');

    const transfer = await this.prisma.transfer.create({
      data: {
        code: dto.code,
        fromWarehouseId: dto.fromWarehouseId,
        toWarehouseId: dto.toWarehouseId,
        items: { create: dto.items },
      },
      include: this.include,
    });

    return { message: 'Transfer created successfully', data: transfer };
  }

  async findAll() {
    return {
      data: await this.prisma.transfer.findMany({
        include: this.include,
        orderBy: { createdAt: 'desc' },
      }),
    };
  }

  async findOne(id: string) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
      include: this.include,
    });
    if (!transfer) throw new NotFoundException('Transfer not found');
    return { data: transfer };
  }

  // Saat status jadi COMPLETED: kurangi stok di fromWarehouse, tambah di
  // toWarehouse untuk tiap item, sekaligus catat Movement di kedua sisi -
  // semuanya dalam satu transaction biar konsisten (all-or-nothing).
  async updateStatus(id: string, dto: UpdateTransferStatusDto) {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
      include: this.include,
    });
    if (!transfer) throw new NotFoundException('Transfer not found');

    if (transfer.status === 'COMPLETED' || transfer.status === 'CANCELLED') {
      throw new BadRequestException(
        `Transfer already ${transfer.status.toLowerCase()}, cannot change status`,
      );
    }

    if (dto.status !== 'COMPLETED') {
      const updated = await this.prisma.transfer.update({
        where: { id },
        data: { status: dto.status },
        include: this.include,
      });
      return { message: 'Transfer status updated successfully', data: updated };
    }

    // status -> COMPLETED: proses pemindahan stok beneran
    const operations: any[] = [];

    for (const item of transfer.items) {
      const fromStock = await this.prisma.stock.findUnique({
        where: {
          warehouseId_productId: {
            warehouseId: transfer.fromWarehouseId,
            productId: item.productId,
          },
        },
      });

      if (!fromStock || fromStock.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${item.productId} in source warehouse`,
        );
      }

      const fromAfter = fromStock.quantity - item.quantity;
      operations.push(
        this.prisma.stock.update({
          where: { id: fromStock.id },
          data: { quantity: fromAfter },
        }),
        this.prisma.movement.create({
          data: {
            stockId: fromStock.id,
            type: 'TRANSFER',
            quantity: -item.quantity,
            beforeQty: fromStock.quantity,
            afterQty: fromAfter,
            reference: transfer.code,
          },
        }),
      );

      const toStock = await this.prisma.stock.upsert({
        where: {
          warehouseId_productId: {
            warehouseId: transfer.toWarehouseId,
            productId: item.productId,
          },
        },
        update: {},
        create: {
          warehouseId: transfer.toWarehouseId,
          productId: item.productId,
          quantity: 0,
        },
      });

      const toAfter = toStock.quantity + item.quantity;
      operations.push(
        this.prisma.stock.update({
          where: { id: toStock.id },
          data: { quantity: toAfter },
        }),
        this.prisma.movement.create({
          data: {
            stockId: toStock.id,
            type: 'TRANSFER',
            quantity: item.quantity,
            beforeQty: toStock.quantity,
            afterQty: toAfter,
            reference: transfer.code,
          },
        }),
      );
    }

    operations.push(
      this.prisma.transfer.update({
        where: { id },
        data: { status: 'COMPLETED' },
      }),
    );

    await this.prisma.$transaction(operations);

    const updated = await this.findOne(id);
    return { message: 'Transfer completed successfully', data: updated.data };
  }
}
