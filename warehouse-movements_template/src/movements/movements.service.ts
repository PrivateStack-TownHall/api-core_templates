import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(stockId?: string) {
    const where = stockId ? { stockId } : {};
    const movements = await this.prisma.movement.findMany({
      where,
      include: { stock: { include: { product: true, warehouse: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data: movements };
  }
}
