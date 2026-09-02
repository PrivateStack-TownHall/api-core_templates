import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThreadStarsService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(threadId: string, userId: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId },
    });
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    const existing = await this.prisma.threadStar.findUnique({
      where: { userId_threadId: { userId, threadId } },
    });

    if (existing) {
      await this.prisma.threadStar.delete({ where: { id: existing.id } });
      return { message: 'Thread unstarred', data: { starred: false } };
    }

    await this.prisma.threadStar.create({ data: { threadId, userId } });
    return { message: 'Thread starred', data: { starred: true } };
  }

  async myStarred(userId: string) {
    const stars = await this.prisma.threadStar.findMany({
      where: { userId },
      include: {
        thread: {
          include: { author: { select: { id: true, fullName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: stars.map((s) => s.thread) };
  }
}
