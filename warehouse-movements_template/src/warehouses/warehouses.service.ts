import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: {
    code: string;
    name: string;
    address?: string;
    capacity: number;
  }) {
    const existing = await this.prisma.warehouse.findUnique({
      where: { code: dto.code },
    });
    if (existing) throw new ConflictException('Warehouse code already exists');

    const warehouse = await this.prisma.warehouse.create({ data: dto });
    return { message: 'Warehouse created successfully', data: warehouse };
  }

  async findAll() {
    return {
      data: await this.prisma.warehouse.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return { data: warehouse };
  }

  async update(
    id: string,
    dto: Partial<{
      code: string;
      name: string;
      address: string;
      capacity: number;
    }>,
  ) {
    await this.findOne(id);
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: dto,
    });
    return { message: 'Warehouse updated successfully', data: warehouse };
  }

  async remove(id: string) {
    await this.findOne(id);
    const stockCount = await this.prisma.stock.count({
      where: { warehouseId: id },
    });
    if (stockCount > 0)
      throw new ConflictException(
        'Warehouse still has stock records, cannot be deleted',
      );
    await this.prisma.warehouse.delete({ where: { id } });
    return { message: 'Warehouse deleted successfully' };
  }
}
