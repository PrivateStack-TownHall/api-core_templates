import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByBook(bookId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { bookId },
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data: reviews };
  }

  async create(bookId: string, userId: string, dto: CreateReviewDto) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');

    const existing = await this.prisma.review.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
    if (existing)
      throw new ConflictException('You have already reviewed this book');

    const review = await this.prisma.review.create({
      data: { bookId, userId, rating: dto.rating, comment: dto.comment },
    });

    return { message: 'Review added successfully', data: review };
  }

  async update(id: string, userId: string, role: Role, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own review');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: dto,
    });
    return { message: 'Review updated successfully', data: updated };
  }

  async remove(id: string, userId: string, role: Role) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own review');
    }

    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted successfully' };
  }
}
