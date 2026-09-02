import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsResponseDto } from './dto/stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponseDto> {
    const [
      totalPosts,
      totalCategories,
      totalComments,
      totalLikes,
      totalUsers,
      totalAdmins,
      totalNotifications,
      unreadNotifications,
      latestPost,
      latestComment,
    ] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.postCategory.count(),
      this.prisma.postComment.count(),
      this.prisma.postLike.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.notification.count(),
      this.prisma.notification.count({ where: { isRead: false } }),
      this.prisma.post.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.postComment.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      application: { name: 'Codigram', type: 'SOCIAL_MEDIA' },
      posts: { total: totalPosts },
      categories: { total: totalCategories },
      comments: { total: totalComments },
      likes: { total: totalLikes },
      users: {
        total: totalUsers,
        admins: totalAdmins,
        members: totalUsers - totalAdmins,
      },
      notifications: { total: totalNotifications, unread: unreadNotifications },
      latest: {
        post: latestPost?.createdAt ?? null,
        comment: latestComment?.createdAt ?? null,
      },
    };
  }
}
