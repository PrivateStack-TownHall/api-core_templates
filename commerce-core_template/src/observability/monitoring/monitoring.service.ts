import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { MonitoringResponseDto } from './dto/monitoring-response.dto';

@Injectable()
export class MonitoringService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonitoring(): Promise<MonitoringResponseDto> {
    const start = Date.now();

    let databaseStatus: 'CONNECTED' | 'DISCONNECTED' = 'CONNECTED';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      databaseStatus = 'DISCONNECTED';
    }

    const latency = Date.now() - start;

    const memory = process.memoryUsage();

    return {
      application: 'Kings Brew',

      node: {
        version: process.version,
        uptime: Math.floor(process.uptime()),
        platform: process.platform,
        environment: process.env.NODE_ENV ?? 'development',
      },

      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
      },

      database: {
        status: databaseStatus,
        latency,
      },

      response: {
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
