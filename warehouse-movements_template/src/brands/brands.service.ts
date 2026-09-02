import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string; description?: string }) {
    const existing = await this.prisma.brand.findUnique({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('Brand name already exists');

    const brand = await this.prisma.brand.create({ data: dto });
    return { message: 'Brand created successfully', data: brand };
  }

  async findAll() {
    return {
      data: await this.prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return { data: brand };
  }

  async update(
    id: string,
    dto: Partial<{ name: string; description: string }>,
  ) {
    await this.findOne(id);
    const brand = await this.prisma.brand.update({ where: { id }, data: dto });
    return { message: 'Brand updated successfully', data: brand };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.brand.delete({ where: { id } });
    return { message: 'Brand deleted successfully' };
  }
}
