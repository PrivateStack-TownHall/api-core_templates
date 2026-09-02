import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsResponseDto } from './dto/stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponseDto> {
    const [
      totalThreads,
      totalComments,
      totalLikes,
      totalStars,
      totalUsers,
      totalAdmins,
      totalNotifications,
      unreadNotifications,
      latestThread,
      latestComment,
    ] = await Promise.all([
      this.prisma.thread.count(),
      this.prisma.threadComment.count(),
      this.prisma.threadLike.count(),
      this.prisma.threadStar.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.notification.count(),
      this.prisma.notification.count({ where: { isRead: false } }),
      this.prisma.thread.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.threadComment.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      application: { name: 'Pineapple Stack', type: 'FORUM' },
      threads: { total: totalThreads },
      comments: { total: totalComments },
      likes: { total: totalLikes },
      stars: { total: totalStars },
      users: {
        total: totalUsers,
        admins: totalAdmins,
        members: totalUsers - totalAdmins,
      },
      notifications: { total: totalNotifications, unread: unreadNotifications },
      latest: {
        thread: latestThread?.createdAt ?? null,
        comment: latestComment?.createdAt ?? null,
      },
    };
  }
}
