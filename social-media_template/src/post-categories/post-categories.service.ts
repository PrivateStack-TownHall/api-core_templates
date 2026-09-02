import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';

@Injectable()
export class PostCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostCategoryDto) {
    const category = await this.prisma.postCategory.create({ data: dto });
    return { message: 'Category created successfully', data: category };
  }

  async findAll() {
    const categories = await this.prisma.postCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return { data: categories };
  }

  async findOne(id: string) {
    const category = await this.prisma.postCategory.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return { data: category };
  }

  async update(id: string, dto: UpdatePostCategoryDto) {
    await this.findOne(id);
    const category = await this.prisma.postCategory.update({
      where: { id },
      data: dto,
    });
    return { message: 'Category updated successfully', data: category };
  }

  async remove(id: string) {
    await this.findOne(id);

    const postCount = await this.prisma.post.count({
      where: { categoryId: id },
    });
    if (postCount > 0) {
      throw new ConflictException(
        'Category still has posts, cannot be deleted',
      );
    }

    await this.prisma.postCategory.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
