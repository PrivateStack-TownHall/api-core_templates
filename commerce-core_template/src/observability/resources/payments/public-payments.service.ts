import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PublicPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.payment.findMany({
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
    const data = await this.prisma.payment.findUnique({
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
          },
        },
      },
    });

    return {
      data,
    };
  }
}
