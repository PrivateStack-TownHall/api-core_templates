import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppType } from '@prisma/client';

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
        where: { appType: AppType.PINEAPPLE },
        include: { user: { select: this.userSelect } },
        orderBy: { createdAt: 'desc' },
      }),
    };
  }

  async findOne(id: string) {
    const auditLog = await this.prisma.auditLog.findFirst({
      where: { id, appType: AppType.PINEAPPLE },
      include: { user: { select: this.userSelect } },
    });

    if (!auditLog) {
      throw new NotFoundException('Audit log not found');
    }

    return { data: auditLog };
  }

  async findByUser(userId: string) {
    return {
      data: await this.prisma.auditLog.findMany({
        where: { userId, appType: AppType.PINEAPPLE },
        include: { user: { select: this.userSelect } },
        orderBy: { createdAt: 'desc' },
      }),
    };
  }

  // Setiap log otomatis ditandai appType PINEAPPLE - meski tabelnya di-share
  // ke 4 app lain, query di sini selalu ke-filter ke log milik app ini saja.
  async create(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
  }) {
    return this.prisma.auditLog.create({
      data: { ...data, appType: AppType.PINEAPPLE },
    });
  }
}
