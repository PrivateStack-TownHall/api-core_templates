import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { locationId: string; name: string }) {
    const location = await this.prisma.location.findUnique({
      where: { id: dto.locationId },
    });
    if (!location) throw new NotFoundException('Location not found');

    const department = await this.prisma.department.create({ data: dto });
    return { message: 'Department created successfully', data: department };
  }

  async findAll() {
    return {
      data: await this.prisma.department.findMany({
        include: { location: true },
        orderBy: { name: 'asc' },
      }),
    };
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: { location: true },
    });
    if (!department) throw new NotFoundException('Department not found');
    return { data: department };
  }

  async update(id: string, dto: { name?: string; locationId?: string }) {
    await this.findOne(id);
    const department = await this.prisma.department.update({
      where: { id },
      data: dto,
    });
    return { message: 'Department updated successfully', data: department };
  }

  async remove(id: string) {
    await this.findOne(id);
    // employeeProfile.departmentId di-set null otomatis (onDelete: SetNull di schema),
    // jadi hapus department gak akan gagal walau masih ada employee di dalamnya.
    await this.prisma.department.delete({ where: { id } });
    return { message: 'Department deleted successfully' };
  }
}
