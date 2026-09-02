import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { regionId: string; name: string }) {
    const region = await this.prisma.region.findUnique({
      where: { id: dto.regionId },
    });
    if (!region) throw new NotFoundException('Region not found');

    const country = await this.prisma.country.create({ data: dto });
    return { message: 'Country created successfully', data: country };
  }

  async findAll(regionId?: string) {
    const where = regionId ? { regionId } : {};
    return {
      data: await this.prisma.country.findMany({
        where,
        include: { region: true },
        orderBy: { name: 'asc' },
      }),
    };
  }

  async findOne(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: { region: true },
    });
    if (!country) throw new NotFoundException('Country not found');
    return { data: country };
  }

  async update(id: string, dto: { name?: string; regionId?: string }) {
    await this.findOne(id);
    const country = await this.prisma.country.update({
      where: { id },
      data: dto,
    });
    return { message: 'Country updated successfully', data: country };
  }

  async remove(id: string) {
    await this.findOne(id);
    const locationCount = await this.prisma.location.count({
      where: { countryId: id },
    });
    if (locationCount > 0)
      throw new ConflictException(
        'Country still has locations, cannot be deleted',
      );
    await this.prisma.country.delete({ where: { id } });
    return { message: 'Country deleted successfully' };
  }
}
