import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Singleton-style: cuma ada 1 record settings per instalasi.
  async get() {
    const settings = await this.prisma.setting.findFirst();
    if (!settings) {
      throw new NotFoundException(
        'Settings not initialized yet - create it first',
      );
    }
    return { data: settings };
  }

  async create(dto: {
    warehouseName: string;
    warehouseCode: string;
    warehouseAddress: string;
    warehouseCapacity: number;
  }) {
    const existing = await this.prisma.setting.findFirst();
    if (existing) {
      const updated = await this.prisma.setting.update({
        where: { id: existing.id },
        data: dto,
      });
      return { message: 'Settings updated successfully', data: updated };
    }

    const settings = await this.prisma.setting.create({ data: dto });
    return { message: 'Settings created successfully', data: settings };
  }

  async update(
    dto: Partial<{
      warehouseName: string;
      warehouseCode: string;
      warehouseAddress: string;
      warehouseCapacity: number;
      lowStockAlert: boolean;
      dailyReport: boolean;
      transferNotification: boolean;
      autoBackup: boolean;
      sessionTimeout: number;
    }>,
  ) {
    const existing = await this.prisma.setting.findFirst();
    if (!existing) {
      throw new NotFoundException(
        'Settings not initialized yet - create it first',
      );
    }

    const settings = await this.prisma.setting.update({
      where: { id: existing.id },
      data: dto,
    });
    return { message: 'Settings updated successfully', data: settings };
  }
}
