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
    application: { name: 'Codigram', type: 'SOCIAL_MEDIA' },
    posts: { total: 80 },
    categories: { total: 4 },
    comments: { total: 200 },
    likes: { total: 500 },
    users: { total: 30, admins: 1, members: 29 },
    notifications: { total: 250, unread: 40 },
    latest: {
      post: '2026-08-30T00:00:00.000Z',
      comment: '2026-08-30T01:00:00.000Z',
    },
  })
  getStats() {
    return this.statsService.getStats();
  }
}
