import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsResponseDto } from './dto/stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponseDto> {
    const [
      totalBooks,
      totalAuthors,
      totalPublishers,
      totalGenres,
      totalReviews,
      totalUsers,
      totalAdmins,
      avgReview,
      copiesAgg,
      latestBook,
      latestReview,
    ] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.author.count(),
      this.prisma.publisher.count(),
      this.prisma.genre.count(),
      this.prisma.review.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
      this.prisma.book.aggregate({ _sum: { totalCopies: true } }),
      this.prisma.book.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.review.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      application: { name: 'Leather Shelf', type: 'LIBRARY' },
      books: {
        total: totalBooks,
        totalCopies: copiesAgg._sum.totalCopies ?? 0,
      },
      authors: { total: totalAuthors },
      publishers: { total: totalPublishers },
      genres: { total: totalGenres },
      reviews: {
        total: totalReviews,
        averageRating: Number(avgReview._avg.rating ?? 0),
      },
      users: {
        total: totalUsers,
        admins: totalAdmins,
        members: totalUsers - totalAdmins,
      },
      latest: {
        book: latestBook?.createdAt ?? null,
        review: latestReview?.createdAt ?? null,
      },
    };
  }
}
