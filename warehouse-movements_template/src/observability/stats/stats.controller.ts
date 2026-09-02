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
    application: { name: 'WareTrack', type: 'INVENTORY' },
    products: { total: 120, active: 110, inactive: 10 },
    categories: { total: 8 },
    brands: { total: 15 },
    warehouses: { total: 3 },
    stocks: { total: 340, totalQuantity: 15000 },
    suppliers: { total: 20, active: 18 },
    purchases: { total: 60, pending: 5, completed: 50, cancelled: 5 },
    transfers: { total: 25, pending: 2, completed: 20, cancelled: 3 },
    latest: {
      product: '2026-08-30T00:00:00.000Z',
      purchase: '2026-08-30T01:00:00.000Z',
      transfer: '2026-08-30T02:00:00.000Z',
    },
  })
  getStats() {
    return this.statsService.getStats();
  }
}
