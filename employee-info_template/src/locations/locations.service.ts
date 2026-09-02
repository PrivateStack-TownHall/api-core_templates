import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: {
    countryId: string;
    city: string;
    streetAddress?: string;
    postalCode?: string;
    stateProvince?: string;
  }) {
    const country = await this.prisma.country.findUnique({
      where: { id: dto.countryId },
    });
    if (!country) throw new NotFoundException('Country not found');

    const location = await this.prisma.location.create({ data: dto });
    return { message: 'Location created successfully', data: location };
  }

  async findAll(countryId?: string) {
    const where = countryId ? { countryId } : {};
    return {
      data: await this.prisma.location.findMany({
        where,
        include: { country: true },
      }),
    };
  }

  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: { country: true },
    });
    if (!location) throw new NotFoundException('Location not found');
    return { data: location };
  }

  async update(
    id: string,
    dto: Partial<{
      city: string;
      streetAddress: string;
      postalCode: string;
      stateProvince: string;
    }>,
  ) {
    await this.findOne(id);
    const location = await this.prisma.location.update({
      where: { id },
      data: dto,
    });
    return { message: 'Location updated successfully', data: location };
  }

  async remove(id: string) {
    await this.findOne(id);
    const deptCount = await this.prisma.department.count({
      where: { locationId: id },
    });
    if (deptCount > 0)
      throw new ConflictException(
        'Location still has departments, cannot be deleted',
      );
    await this.prisma.location.delete({ where: { id } });
    return { message: 'Location deleted successfully' };
  }
}
