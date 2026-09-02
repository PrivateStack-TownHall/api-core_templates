import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDependentDto } from './dto/create-dependent.dto';
import { UpdateDependentDto } from './dto/update-dependent.dto';

@Injectable()
export class DependentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmployee(employeeId: string) {
    return {
      data: await this.prisma.dependent.findMany({ where: { employeeId } }),
    };
  }

  async create(userId: string, isAdmin: boolean, dto: CreateDependentDto) {
    const employee = await this.prisma.employeeProfile.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) throw new NotFoundException('Employee profile not found');
    if (!isAdmin && employee.userId !== userId) {
      throw new ForbiddenException(
        'You can only add dependents to your own profile',
      );
    }

    const dependent = await this.prisma.dependent.create({ data: dto });
    return { message: 'Dependent added successfully', data: dependent };
  }

  async update(
    id: string,
    userId: string,
    isAdmin: boolean,
    dto: UpdateDependentDto,
  ) {
    const dependent = await this.prisma.dependent.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!dependent) throw new NotFoundException('Dependent not found');
    if (!isAdmin && dependent.employee.userId !== userId) {
      throw new ForbiddenException('You can only update your own dependents');
    }

    const updated = await this.prisma.dependent.update({
      where: { id },
      data: dto,
    });
    return { message: 'Dependent updated successfully', data: updated };
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const dependent = await this.prisma.dependent.findUnique({
      where: { id },
      include: { employee: true },
    });
    if (!dependent) throw new NotFoundException('Dependent not found');
    if (!isAdmin && dependent.employee.userId !== userId) {
      throw new ForbiddenException('You can only delete your own dependents');
    }

    await this.prisma.dependent.delete({ where: { id } });
    return { message: 'Dependent deleted successfully' };
  }
}
