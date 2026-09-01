import { Controller, Get } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { StatsService } from './stats.service';

import { SwaggerSuccess } from '../../common/swagger/swagger-response';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application statistics',
  })
  @SwaggerSuccess({
    success: true,
    application: {
      name: 'Kings Brew',
      type: 'COFFEE',
    },
    products: { total: 42, active: 38, inactive: 4 },
    categories: { total: 5 },
    images: { total: 60 },
    reviews: { total: 120, averageRating: 4.6 },
    orders: { total: 200, pending: 10, completed: 180, cancelled: 10 },
    payments: { total: 195, success: 180, failed: 15 },
    favorites: { total: 75 },
    latest: {
      product: '2026-06-18T00:00:00.000Z',
      review: '2026-06-17T00:00:00.000Z',
      order: '2026-06-18T01:00:00.000Z',
    },
  })
  getStats() {
    return this.statsService.getStats();
  }
}
