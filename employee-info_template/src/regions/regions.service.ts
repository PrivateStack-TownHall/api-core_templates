import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string }) {
    const region = await this.prisma.region.create({ data: dto });
    return { message: 'Region created successfully', data: region };
  }

  async findAll() {
    return {
      data: await this.prisma.region.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw new NotFoundException('Region not found');
    return { data: region };
  }

  async update(id: string, dto: { name?: string }) {
    await this.findOne(id);
    const region = await this.prisma.region.update({
      where: { id },
      data: dto,
    });
    return { message: 'Region updated successfully', data: region };
  }

  async remove(id: string) {
    await this.findOne(id);
    const countryCount = await this.prisma.country.count({
      where: { regionId: id },
    });
    if (countryCount > 0)
      throw new ConflictException(
        'Region still has countries, cannot be deleted',
      );
    await this.prisma.region.delete({ where: { id } });
    return { message: 'Region deleted successfully' };
  }
}
