import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthModule } from './observability/health/health.module';
import { StatsModule } from './observability/stats/stats.module';

import { PostCategoriesModule } from './post-categories/post-categories.module';
import { PostsModule } from './posts/posts.module';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,

    UsersModule,
    AuthModule,

    PostCategoriesModule,
    PostsModule,
    PostCommentsModule,
    PostLikesModule,
    NotificationsModule,

    AuditLogsModule,
    HealthModule,
    StatsModule,
  ],
})
export class AppModule {}
