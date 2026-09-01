import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { StatsResponseDto } from './dto/stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponseDto> {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalImages,
      totalReviews,
      totalOrders,
      totalFavorites,
      totalPayments,
      avgReview,
      latestProduct,
      latestReview,
      latestOrder,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      successPayments,
      failedPayments,
    ] = await Promise.all([
      this.prisma.product.count(),

      this.prisma.product.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.category.count(),

      this.prisma.productImage.count(),

      this.prisma.review.count(),

      this.prisma.order.count(),

      this.prisma.favorite.count(),

      this.prisma.payment.count(),

      this.prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),

      this.prisma.product.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
        },
      }),

      this.prisma.review.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
        },
      }),

      this.prisma.order.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
        },
      }),

      this.prisma.order.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.order.count({
        where: {
          status: 'COMPLETED',
        },
      }),

      this.prisma.order.count({
        where: {
          status: 'CANCELLED',
        },
      }),

      this.prisma.payment.count({
        where: {
          status: 'SUCCESS',
        },
      }),

      this.prisma.payment.count({
        where: {
          status: 'FAILED',
        },
      }),
    ]);

    return {
      application: {
        name: 'Kings Brew',
        type: 'COFFEE',
      },

      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
      },

      categories: {
        total: totalCategories,
      },

      images: {
        total: totalImages,
      },

      reviews: {
        total: totalReviews,
        averageRating: Number(avgReview._avg.rating ?? 0),
      },

      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },

      payments: {
        total: totalPayments,
        success: successPayments,
        failed: failedPayments,
      },

      favorites: {
        total: totalFavorites,
      },

      latest: {
        product: latestProduct?.createdAt ?? null,
        review: latestReview?.createdAt ?? null,
        order: latestOrder?.createdAt ?? null,
      },
    };
  }
}
