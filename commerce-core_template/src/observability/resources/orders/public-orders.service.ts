import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PublicOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },

        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },

        payments: true,

        histories: {
          orderBy: {
            createdAt: 'desc',
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
    const data = await this.prisma.order.findUnique({
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

        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },

        payments: true,

        histories: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return {
      data,
    };
  }
}
