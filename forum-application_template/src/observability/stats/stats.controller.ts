import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { StatsService } from './stats.service';
import { SwaggerSuccess } from '../../common/swagger/swagger-response';

// Public - statistik ringkasan buat dashboard/demo, gak ada data sensitif individual.
@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get application statistics' })
  @SwaggerSuccess({
    success: true,
    application: { name: 'Pineapple Stack', type: 'FORUM' },
    threads: { total: 42 },
    comments: { total: 120 },
    likes: { total: 300 },
    stars: { total: 80 },
    users: { total: 25, admins: 1, members: 24 },
    notifications: { total: 150, unread: 30 },
    latest: {
      thread: '2026-08-30T00:00:00.000Z',
      comment: '2026-08-30T01:00:00.000Z',
    },
  })
  getStats() {
    return this.statsService.getStats();
  }
}
