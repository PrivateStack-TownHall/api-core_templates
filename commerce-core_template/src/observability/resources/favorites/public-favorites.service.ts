import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PublicFavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.favorite.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
    };
  }

  async findOne(id: number) {
    const data = await this.prisma.favorite.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },
    });

    return {
      data,
    };
  }
}
