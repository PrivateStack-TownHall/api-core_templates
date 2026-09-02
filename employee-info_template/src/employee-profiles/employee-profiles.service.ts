import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';

@Injectable()
export class EmployeeProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = { id: true, fullName: true, email: true };
  private readonly include = {
    user: { select: this.userSelect },
    department: true,
    job: true,
  };

  async create(dto: CreateEmployeeProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.employeeProfile.findUnique({
      where: { userId: dto.userId },
    });
    if (existing)
      throw new ConflictException('This user already has an employee profile');

    const profile = await this.prisma.employeeProfile.create({
      data: {
        ...dto,
        hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      },
      include: this.include,
    });

    return { message: 'Employee profile created successfully', data: profile };
  }

  async findAll() {
    return {
      data: await this.prisma.employeeProfile.findMany({
        include: this.include,
      }),
    };
  }

  async findOne(id: string) {
    const profile = await this.prisma.employeeProfile.findUnique({
      where: { id },
      include: this.include,
    });
    if (!profile) throw new NotFoundException('Employee profile not found');
    return { data: profile };
  }

  // Self-or-admin: dipanggil dari controller setelah cek ownership
  async update(id: string, dto: UpdateEmployeeProfileDto) {
    await this.findOne(id);

    const profile = await this.prisma.employeeProfile.update({
      where: { id },
      data: {
        ...dto,
        hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined,
      },
      include: this.include,
    });

    return { message: 'Employee profile updated successfully', data: profile };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.employeeProfile.delete({ where: { id } });
    return { message: 'Employee profile deleted successfully' };
  }
}
