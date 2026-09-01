import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PublicOrderStatusHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.orderStatusHistory.findMany({
      include: {
        order: {
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
    const data = await this.prisma.orderStatusHistory.findUnique({
      where: {
        id,
      },

      include: {
        order: {
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
          },
        },
      },
    });

    return {
      data,
    };
  }
}
