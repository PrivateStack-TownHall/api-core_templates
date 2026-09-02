import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    supplier: true,
    items: { include: { product: true } },
  };

  async create(dto: CreatePurchaseDto) {
    const existing = await this.prisma.purchase.findUnique({
      where: { invoice: dto.invoice },
    });
    if (existing) throw new ConflictException('Invoice number already exists');

    const total = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const purchase = await this.prisma.purchase.create({
      data: {
        supplierId: dto.supplierId,
        invoice: dto.invoice,
        purchaseDate: new Date(dto.purchaseDate),
        total,
        items: { create: dto.items },
      },
      include: this.include,
    });

    return { message: 'Purchase created successfully', data: purchase };
  }

  async findAll() {
    return {
      data: await this.prisma.purchase.findMany({
        include: this.include,
        orderBy: { createdAt: 'desc' },
      }),
    };
  }

  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: this.include,
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return { data: purchase };
  }

  // Kalau status jadi COMPLETED, otomatis nambah stok tiap item pembelian
  // (kalau belum ada Stock record untuk kombinasi warehouse+product itu,
  // ini disederhanakan: item harus sudah punya Stock record, di-adjust lewat
  // endpoint /stocks/:id/adjust secara manual - keputusan desain biar
  // gak perlu tebak warehouse mana yang dituju otomatis).
  async updateStatus(id: string, dto: UpdatePurchaseStatusDto) {
    const purchase = await this.findOne(id);

    if (
      purchase.data.status === 'COMPLETED' ||
      purchase.data.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        `Purchase already ${purchase.data.status.toLowerCase()}, cannot change status`,
      );
    }

    const updated = await this.prisma.purchase.update({
      where: { id },
      data: {
        status: dto.status,
        receivedAt: dto.status === 'COMPLETED' ? new Date() : undefined,
      },
      include: this.include,
    });

    return { message: 'Purchase status updated successfully', data: updated };
  }
}
