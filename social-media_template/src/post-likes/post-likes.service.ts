import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostLikesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existing = await this.prisma.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await this.prisma.postLike.delete({
        where: { userId_postId: { userId, postId } },
      });
      return { message: 'Post unliked', data: { liked: false } };
    }

    await this.prisma.postLike.create({ data: { postId, userId } });

    if (post.userId !== userId) {
      await this.prisma.notification.create({
        data: {
          recipientId: post.userId,
          actorId: userId,
          type: 'POST_LIKED',
          entityType: 'Post',
          entityId: post.id,
        },
      });
    }

    return { message: 'Post liked', data: { liked: true } };
  }
}
