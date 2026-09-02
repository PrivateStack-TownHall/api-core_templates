import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: {
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    notes?: string;
  }) {
    const supplier = await this.prisma.supplier.create({ data: dto });
    return { message: 'Supplier created successfully', data: supplier };
  }

  async findAll() {
    return {
      data: await this.prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return { data: supplier };
  }

  async update(
    id: string,
    dto: Partial<{
      name: string;
      contactPerson: string;
      phone: string;
      email: string;
      website: string;
      address: string;
      notes: string;
      isActive: boolean;
    }>,
  ) {
    await this.findOne(id);
    const supplier = await this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
    return { message: 'Supplier updated successfully', data: supplier };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Supplier deactivated successfully' };
  }
}
