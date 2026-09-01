import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, productId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        productId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (favorite) {
      throw new BadRequestException('Product already in favorites');
    }

    return {
      message: 'Favorite added successfully',

      data: await this.prisma.favorite.create({
        data: {
          userId,
          productId,
        },

        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      }),
    };
  }

  async findAll(userId: number) {
    return {
      data: await this.prisma.favorite.findMany({
        where: {
          userId,

          product: {
            appType: AppType.COFFEE,
          },
        },

        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },

        orderBy: {
          id: 'desc',
        },
      }),
    };
  }

  async remove(id: number, userId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        id,
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Favorite removed successfully',
    };
  }
}
