import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { ActivityResponseDto } from './dto/activity-response.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivities(): Promise<ActivityResponseDto[]> {
    const [
      latestProducts,
      latestCategories,
      latestImages,
      latestReviews,
      latestOrders,
      latestPayments,
      latestFavorites,
    ] = await Promise.all([
      this.prisma.product.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.category.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.productImage.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.review.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.payment.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.favorite.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const activities: ActivityResponseDto[] = [
      ...latestProducts.map((item) => ({
        id: `product-${item.id}`,
        type: 'PRODUCT_CREATED',
        entity: 'Product',
        title: item.name,
        description: 'New product created',
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),

      ...latestCategories.map((item) => ({
        id: `category-${item.id}`,
        type: 'CATEGORY_CREATED',
        entity: 'Category',
        title: item.name,
        description: 'New category created',
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),

      ...latestImages.map((item) => ({
        id: `image-${item.id}`,
        type: 'IMAGE_UPLOADED',
        entity: 'Image',
        title: item.imageUrl,
        description: 'New product image uploaded',
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),

      ...latestReviews.map((item) => ({
        id: `review-${item.id}`,
        type: 'REVIEW_CREATED',
        entity: 'Review',
        title: `${item.rating} Stars`,
        description: item.comment ?? 'New review submitted',
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),

      ...latestOrders.map((item) => ({
        id: `order-${item.id}`,
        type: 'ORDER_CREATED',
        entity: 'Order',
        title: `#${item.id}`,
        description: `Order ${item.status}`,
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),

      ...latestPayments.map((item) => ({
        id: `payment-${item.id}`,
        type: 'PAYMENT_CREATED',
        entity: 'Payment',
        title: item.status,
        description: 'Payment recorded',
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),

      ...latestFavorites.map((item) => ({
        id: `favorite-${item.id}`,
        type: 'FAVORITE_CREATED',
        entity: 'Favorite',
        title: `Product #${item.productId}`,
        description: 'Product added to favorites',
        createdAt: item.createdAt,
        application: 'Kings Brew',
      })),
    ];

    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 30);
  }
}
