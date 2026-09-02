import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    publisher: true,
    authors: { include: { author: true } },
    genres: { include: { genre: true } },
    _count: { select: { reviews: true } },
  };

  async create(dto: CreateBookDto) {
    const { authorIds, genreIds, ...rest } = dto;

    const book = await this.prisma.book.create({
      data: {
        ...rest,
        authors: authorIds
          ? { create: authorIds.map((authorId) => ({ authorId })) }
          : undefined,
        genres: genreIds
          ? { create: genreIds.map((genreId) => ({ genreId })) }
          : undefined,
      },
      include: this.include,
    });

    return { message: 'Book created successfully', data: book };
  }

  async findAll(query: QueryBookDto) {
    const where: Prisma.BookWhereInput = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.genreId) {
      where.genres = { some: { genreId: query.genreId } };
    }

    const books = await this.prisma.book.findMany({
      where,
      include: this.include,
      orderBy: { title: 'asc' },
    });
    return { data: books };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        ...this.include,
        reviews: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const avgRating =
      book.reviews.length > 0
        ? book.reviews.reduce((sum, r) => sum + r.rating, 0) /
          book.reviews.length
        : null;

    return { data: { ...book, averageRating: avgRating } };
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id);
    const { authorIds, genreIds, ...rest } = dto;

    if (authorIds) {
      await this.prisma.bookAuthor.deleteMany({ where: { bookId: id } });
    }
    if (genreIds) {
      await this.prisma.bookGenre.deleteMany({ where: { bookId: id } });
    }

    const book = await this.prisma.book.update({
      where: { id },
      data: {
        ...rest,
        authors: authorIds
          ? { create: authorIds.map((authorId) => ({ authorId })) }
          : undefined,
        genres: genreIds
          ? { create: genreIds.map((genreId) => ({ genreId })) }
          : undefined,
      },
      include: this.include,
    });

    return { message: 'Book updated successfully', data: book };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.book.delete({ where: { id } });
    return { message: 'Book deleted successfully' };
  }
}
