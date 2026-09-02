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
    application: { name: 'Leather Shelf', type: 'LIBRARY' },
    books: { total: 15, totalCopies: 45 },
    authors: { total: 10 },
    publishers: { total: 5 },
    genres: { total: 6 },
    reviews: { total: 30, averageRating: 4.3 },
    users: { total: 12, admins: 1, members: 11 },
    latest: {
      book: '2026-08-30T00:00:00.000Z',
      review: '2026-08-30T01:00:00.000Z',
    },
  })
  getStats() {
    return this.statsService.getStats();
  }
}
