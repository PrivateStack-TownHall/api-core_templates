import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';

@Injectable()
export class PostCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPost(postId: string) {
    const comments = await this.prisma.postComment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    return { data: comments };
  }

  async create(postId: string, userId: string, dto: CreatePostCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.prisma.postComment.create({
      data: { postId, userId, message: dto.message },
    });

    if (post.userId !== userId) {
      await this.prisma.notification.create({
        data: {
          recipientId: post.userId,
          actorId: userId,
          type: 'POST_COMMENTED',
          entityType: 'Post',
          entityId: post.id,
        },
      });
    }

    return { message: 'Comment added successfully', data: comment };
  }

  async update(
    id: string,
    userId: string,
    role: Role,
    dto: UpdatePostCommentDto,
  ) {
    const comment = await this.prisma.postComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own comment');
    }

    const updated = await this.prisma.postComment.update({
      where: { id },
      data: dto,
    });
    return { message: 'Comment updated successfully', data: updated };
  }

  async remove(id: string, userId: string, role: Role) {
    const comment = await this.prisma.postComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    await this.prisma.postComment.delete({ where: { id } });
    return { message: 'Comment deleted successfully' };
  }
}
