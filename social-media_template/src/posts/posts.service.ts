import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly authorSelect = { id: true, fullName: true, avatarUrl: true };

  async create(userId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        caption: dto.caption,
        imageUrl: dto.imageUrl,
      },
    });
    return { message: 'Post created successfully', data: post };
  }

  async findAll(query: QueryPostDto) {
    const where: Prisma.PostWhereInput = {};
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        author: { select: this.authorSelect },
        category: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: posts };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: this.authorSelect },
        category: true,
        comments: {
          include: { author: { select: this.authorSelect } },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { likes: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return { data: post };
  }

  async update(id: string, userId: string, role: Role, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own post');
    }

    const updated = await this.prisma.post.update({ where: { id }, data: dto });
    return { message: 'Post updated successfully', data: updated };
  }

  async remove(id: string, userId: string, role: Role) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own post');
    }

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted successfully' };
  }
}
