import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { StatsService } from './stats.service';
import { SwaggerSuccess } from '../../common/swagger/swagger-response';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get application statistics' })
  @SwaggerSuccess({
    success: true,
    application: { name: 'M-ployee', type: 'HR' },
    employees: { total: 50 },
    departments: { total: 6 },
    jobs: { total: 10 },
    regions: { total: 2 },
    countries: { total: 3 },
    locations: { total: 4 },
    dependents: { total: 20 },
    latest: { employeeProfile: '2026-08-30T00:00:00.000Z' },
  })
  getStats() {
    return this.statsService.getStats();
  }
}
