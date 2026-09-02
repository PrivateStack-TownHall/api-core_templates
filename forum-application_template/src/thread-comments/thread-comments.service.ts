import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadCommentDto } from './dto/create-thread-comment.dto';
import { UpdateThreadCommentDto } from './dto/update-thread-comment.dto';

@Injectable()
export class ThreadCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByThread(threadId: string) {
    const comments = await this.prisma.threadComment.findMany({
      where: { threadId },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return { data: comments };
  }

  async create(threadId: string, userId: string, dto: CreateThreadCommentDto) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId },
    });
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const comment = await this.prisma.threadComment.create({
      data: { threadId, userId, body: dto.body },
    });

    if (thread.userId !== userId) {
      await this.prisma.notification.create({
        data: {
          recipientId: thread.userId,
          actorId: userId,
          type: 'THREAD_COMMENTED',
          entityType: 'Thread',
          entityId: thread.id,
        },
      });
    }

    return { message: 'Comment added successfully', data: comment };
  }

  async update(
    id: string,
    userId: string,
    role: Role,
    dto: UpdateThreadCommentDto,
  ) {
    const comment = await this.prisma.threadComment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own comment');
    }

    const updated = await this.prisma.threadComment.update({
      where: { id },
      data: dto,
    });
    return { message: 'Comment updated successfully', data: updated };
  }

  async remove(id: string, userId: string, role: Role) {
    const comment = await this.prisma.threadComment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    await this.prisma.threadComment.delete({ where: { id } });
    return { message: 'Comment deleted successfully' };
  }
}
