import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateReviewDto) {
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        productId: dto.productId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists');
    }

    return {
      message: 'Review created successfully',

      data: await this.prisma.review.create({
        data: {
          userId,
          productId: dto.productId,
          rating: dto.rating,
          comment: dto.comment,
        },

        include: {
          user: true,
          product: true,
        },
      }),
    };
  }

  async findAll() {
    return {
      data: await this.prisma.review.findMany({
        where: {
          product: {
            appType: AppType.COFFEE,
          },
        },

        include: {
          user: true,
          product: true,
        },

        orderBy: {
          id: 'desc',
        },
      }),
    };
  }

  async findByProduct(productId: number) {
    return {
      data: await this.prisma.review.findMany({
        where: {
          productId,

          product: {
            appType: AppType.COFFEE,
          },
        },

        include: {
          user: true,
        },

        orderBy: {
          id: 'desc',
        },
      }),
    };
  }

  async update(id: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findFirst({
      where: {
        id,
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return {
      message: 'Review updated successfully',

      data: await this.prisma.review.update({
        where: {
          id,
        },

        data: dto,

        include: {
          user: true,
          product: true,
        },
      }),
    };
  }

  async remove(id: number, userId: number) {
    const review = await this.prisma.review.findFirst({
      where: {
        id,
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Review deleted successfully',
    };
  }
}
