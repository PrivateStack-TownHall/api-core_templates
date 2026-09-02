import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthModule } from './observability/health/health.module';
import { StatsModule } from './observability/stats/stats.module';

import { ThreadStarsModule } from './thread-stars/thread-stars.module'; // sebelum ThreadsModule - hindari '/threads/me/starred' ketabrak '/threads/:slug'
import { ThreadsModule } from './threads/threads.module';
import { ThreadCommentsModule } from './thread-comments/thread-comments.module';
import { ThreadLikesModule } from './thread-likes/thread-likes.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,

    UsersModule,
    AuthModule,

    ThreadStarsModule,
    ThreadsModule,
    ThreadCommentsModule,
    ThreadLikesModule,
    NotificationsModule,

    AuditLogsModule,
    HealthModule,
    StatsModule,
  ],
})
export class AppModule {}
