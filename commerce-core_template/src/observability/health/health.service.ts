import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthResponseDto> {
    let database: 'CONNECTED' | 'DISCONNECTED' = 'CONNECTED';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'DISCONNECTED';
    }

    return {
      status: database === 'CONNECTED' ? 'UP' : 'DOWN',
      application: 'Kings Brew',
      database,
      version: process.env.npm_package_version ?? '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    };
  }
}
