import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublishersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string; website?: string }) {
    const publisher = await this.prisma.publisher.create({ data: dto });
    return { message: 'Publisher created successfully', data: publisher };
  }

  async findAll() {
    return {
      data: await this.prisma.publisher.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const publisher = await this.prisma.publisher.findUnique({ where: { id } });
    if (!publisher) throw new NotFoundException('Publisher not found');
    return { data: publisher };
  }

  async update(id: string, dto: Partial<{ name: string; website: string }>) {
    await this.findOne(id);
    const publisher = await this.prisma.publisher.update({
      where: { id },
      data: dto,
    });
    return { message: 'Publisher updated successfully', data: publisher };
  }

  async remove(id: string) {
    await this.findOne(id);
    const bookCount = await this.prisma.book.count({
      where: { publisherId: id },
    });
    if (bookCount > 0)
      throw new ConflictException(
        'Publisher still has books, cannot be deleted',
      );
    await this.prisma.publisher.delete({ where: { id } });
    return { message: 'Publisher deleted successfully' };
  }
}
