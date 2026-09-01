import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

import { SwaggerSuccess } from '../../common/swagger/swagger-response';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application health status',
  })
  @SwaggerSuccess({
    success: true,
    status: 'UP',
    application: 'Kings Brew',
    database: 'CONNECTED',
    version: '1.0.0',
    timestamp: '2026-06-18T00:00:00.000Z',
    uptime: 123,
  })
  getHealth() {
    return this.healthService.check();
  }
}
