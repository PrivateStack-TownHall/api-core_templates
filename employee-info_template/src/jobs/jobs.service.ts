import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { title: string; minSalary: number; maxSalary: number }) {
    if (dto.maxSalary < dto.minSalary) {
      throw new NotFoundException(
        'maxSalary must be greater than or equal to minSalary',
      );
    }
    const job = await this.prisma.job.create({ data: dto });
    return { message: 'Job created successfully', data: job };
  }

  async findAll() {
    return {
      data: await this.prisma.job.findMany({ orderBy: { title: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return { data: job };
  }

  async update(
    id: string,
    dto: Partial<{ title: string; minSalary: number; maxSalary: number }>,
  ) {
    await this.findOne(id);
    const job = await this.prisma.job.update({ where: { id }, data: dto });
    return { message: 'Job updated successfully', data: job };
  }

  async remove(id: string) {
    await this.findOne(id);
    // employeeProfile.jobId di-set null otomatis (onDelete: SetNull di schema)
    await this.prisma.job.delete({ where: { id } });
    return { message: 'Job deleted successfully' };
  }
}
