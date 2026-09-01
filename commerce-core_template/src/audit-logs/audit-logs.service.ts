import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    fullName: true,
    role: true,
  };

  async findAll() {
    return {
      data: await this.prisma.auditLog.findMany({
        include: {
          user: {
            select: this.userSelect,
          },
        },

        orderBy: {
          id: 'desc',
        },
      }),
    };
  }

  async findOne(id: number) {
    const auditLog = await this.prisma.auditLog.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: this.userSelect,
        },
      },
    });

    if (!auditLog) {
      throw new NotFoundException('Audit log not found');
    }

    return {
      data: auditLog,
    };
  }

  async findByUser(userId: number) {
    return {
      data: await this.prisma.auditLog.findMany({
        where: {
          userId,
        },

        include: {
          user: {
            select: this.userSelect,
          },
        },

        orderBy: {
          id: 'desc',
        },
      }),
    };
  }

  async create(data: {
    userId?: number;
    action: string;
    entity: string;
    entityId?: string;
    oldData?: any;
    newData?: any;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({
      data,
    });
  }
}
