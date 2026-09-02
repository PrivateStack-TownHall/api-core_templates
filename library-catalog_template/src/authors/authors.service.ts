import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string; bio?: string }) {
    const author = await this.prisma.author.create({ data: dto });
    return { message: 'Author created successfully', data: author };
  }

  async findAll() {
    return {
      data: await this.prisma.author.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return { data: author };
  }

  async update(id: string, dto: Partial<{ name: string; bio: string }>) {
    await this.findOne(id);
    const author = await this.prisma.author.update({
      where: { id },
      data: dto,
    });
    return { message: 'Author updated successfully', data: author };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.author.delete({ where: { id } });
    return { message: 'Author deleted successfully' };
  }
}
