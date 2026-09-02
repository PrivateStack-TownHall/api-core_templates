import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WarehouseLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: {
    warehouseId: string;
    code: string;
    name: string;
    capacity: number;
  }) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: dto.warehouseId },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    const existing = await this.prisma.warehouseLocation.findUnique({
      where: { code: dto.code },
    });
    if (existing) throw new ConflictException('Location code already exists');

    const location = await this.prisma.warehouseLocation.create({ data: dto });
    return { message: 'Location created successfully', data: location };
  }

  async findAll(warehouseId?: string) {
    const where = warehouseId ? { warehouseId } : {};
    return {
      data: await this.prisma.warehouseLocation.findMany({
        where,
        include: { warehouse: true },
      }),
    };
  }

  async findOne(id: string) {
    const location = await this.prisma.warehouseLocation.findUnique({
      where: { id },
      include: { warehouse: true },
    });
    if (!location) throw new NotFoundException('Location not found');
    return { data: location };
  }

  async update(
    id: string,
    dto: Partial<{ code: string; name: string; capacity: number }>,
  ) {
    await this.findOne(id);
    const location = await this.prisma.warehouseLocation.update({
      where: { id },
      data: dto,
    });
    return { message: 'Location updated successfully', data: location };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.warehouseLocation.delete({ where: { id } });
    return { message: 'Location deleted successfully' };
  }
}
