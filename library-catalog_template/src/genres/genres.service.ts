import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string }) {
    const genre = await this.prisma.genre.create({ data: dto });
    return { message: 'Genre created successfully', data: genre };
  }

  async findAll() {
    return {
      data: await this.prisma.genre.findMany({ orderBy: { name: 'asc' } }),
    };
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException('Genre not found');
    return { data: genre };
  }

  async update(id: string, dto: { name?: string }) {
    await this.findOne(id);
    const genre = await this.prisma.genre.update({ where: { id }, data: dto });
    return { message: 'Genre updated successfully', data: genre };
  }

  async remove(id: string) {
    await this.findOne(id);
    const bookGenreCount = await this.prisma.bookGenre.count({
      where: { genreId: id },
    });
    if (bookGenreCount > 0)
      throw new ConflictException(
        'Genre is still used by some books, cannot be deleted',
      );
    await this.prisma.genre.delete({ where: { id } });
    return { message: 'Genre deleted successfully' };
  }
}
