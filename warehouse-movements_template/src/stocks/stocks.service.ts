import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class StocksService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = { warehouse: true, location: true, product: true };

  async create(dto: CreateStockDto) {
    const stock = await this.prisma.stock.create({
      data: { ...dto, quantity: dto.quantity ?? 0 },
      include: this.include,
    });
    return { message: 'Stock record created successfully', data: stock };
  }

  async findAll(warehouseId?: string, productId?: string) {
    const where: any = {};
    if (warehouseId) where.warehouseId = warehouseId;
    if (productId) where.productId = productId;

    return {
      data: await this.prisma.stock.findMany({ where, include: this.include }),
    };
  }

  async findOne(id: string) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      include: {
        ...this.include,
        movements: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!stock) throw new NotFoundException('Stock not found');
    return { data: stock };
  }

  // Adjust stok - ini yang bikin Movement record otomatis, ngejaga histori
  // tetap konsisten dengan quantity terkini (before/after selalu tercatat).
  async adjust(id: string, dto: AdjustStockDto) {
    const stock = await this.prisma.stock.findUnique({ where: { id } });
    if (!stock) throw new NotFoundException('Stock not found');

    const beforeQty = stock.quantity;
    const afterQty = beforeQty + dto.quantity;

    if (afterQty < 0) {
      throw new BadRequestException(
        'Resulting stock quantity cannot be negative',
      );
    }

    const [updatedStock] = await this.prisma.$transaction([
      this.prisma.stock.update({
        where: { id },
        data: { quantity: afterQty },
        include: this.include,
      }),
      this.prisma.movement.create({
        data: {
          stockId: id,
          type: dto.type,
          quantity: dto.quantity,
          beforeQty,
          afterQty,
          remarks: dto.remarks,
        },
      }),
    ]);

    return { message: 'Stock adjusted successfully', data: updatedStock };
  }
}
