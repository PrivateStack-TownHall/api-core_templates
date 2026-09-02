import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { QueryThreadDto } from './dto/query-thread.dto';

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable()
export class ThreadsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly authorSelect = { id: true, fullName: true, avatarUrl: true };

  async create(userId: string, dto: CreateThreadDto) {
    const thread = await this.prisma.thread.create({
      data: {
        userId,
        title: dto.title,
        body: dto.body,
        category: dto.category,
        slug: slugify(dto.title),
      },
    });

    return { message: 'Thread created successfully', data: thread };
  }

  async findAll(query: QueryThreadDto) {
    const where: Prisma.ThreadWhereInput = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.category) {
      where.category = query.category;
    }

    const threads = await this.prisma.thread.findMany({
      where,
      include: {
        author: { select: this.authorSelect },
        _count: { select: { comments: true, likes: true, stars: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: threads };
  }

  async findOne(slug: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { slug },
      include: {
        author: { select: this.authorSelect },
        comments: {
          include: { author: { select: this.authorSelect } },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { likes: true, stars: true } },
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return { data: thread };
  }

  async update(id: string, userId: string, role: Role, dto: UpdateThreadDto) {
    const thread = await this.prisma.thread.findUnique({ where: { id } });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (thread.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own thread');
    }

    const updated = await this.prisma.thread.update({
      where: { id },
      data: {
        title: dto.title,
        body: dto.body,
        category: dto.category,
        ...(dto.title ? { slug: slugify(dto.title) } : {}),
      },
    });

    return { message: 'Thread updated successfully', data: updated };
  }

  async remove(id: string, userId: string, role: Role) {
    const thread = await this.prisma.thread.findUnique({ where: { id } });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (thread.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own thread');
    }

    await this.prisma.thread.delete({ where: { id } });

    return { message: 'Thread deleted successfully' };
  }
}
