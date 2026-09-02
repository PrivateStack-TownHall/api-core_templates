import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthModule } from './observability/health/health.module';
import { StatsModule } from './observability/stats/stats.module';

import { AuthorsModule } from './authors/authors.module';
import { PublishersModule } from './publishers/publishers.module';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    PrismaModule,

    UsersModule,
    AuthModule,

    AuthorsModule,
    PublishersModule,
    GenresModule,
    BooksModule,
    ReviewsModule,

    AuditLogsModule,
    HealthModule,
    StatsModule,
  ],
})
export class AppModule {}
