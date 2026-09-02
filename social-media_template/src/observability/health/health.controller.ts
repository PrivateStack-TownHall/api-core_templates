import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';
import { SwaggerSuccess } from '../../common/swagger/swagger-response';

// Public - sengaja gak pakai JwtAuthGuard, dipakai buat health check
// eksternal (Render, uptime monitor, dsb) yang gak punya token.
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @SwaggerSuccess({
    success: true,
    status: 'UP',
    database: 'CONNECTED',
    version: '1.0.0',
    timestamp: '2026-08-30T00:00:00.000Z',
    uptime: 123,
  })
  getHealth() {
    return this.healthService.check();
  }
}
