import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { MonitoringService } from './monitoring.service';

import { SwaggerSuccess } from '../../common/swagger/swagger-response';

@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application monitoring information',
  })
  @SwaggerSuccess({
    success: true,
    application: 'Kings Brew',
    node: {
      version: 'v22.14.0',
      uptime: 123,
      platform: 'linux',
      environment: 'production',
    },
    memory: {
      rss: 65536000,
      heapTotal: 34000000,
      heapUsed: 21000000,
      external: 2000000,
    },
    database: {
      status: 'CONNECTED',
      latency: 12,
    },
    response: {
      generatedAt: '2026-06-18T00:00:00.000Z',
    },
  })
  getMonitoring() {
    return this.monitoringService.getMonitoring();
  }
}
