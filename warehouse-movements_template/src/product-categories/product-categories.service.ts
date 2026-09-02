import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: {
    code: string;
    name: string;
    description?: string;
    icon?: string;
  }) {
    const existing = await this.prisma.productCategory.findUnique({
      where: { code: dto.code },
    });
    if (existing) throw new ConflictException('Category code already exists');

    const category = await this.prisma.productCategory.create({ data: dto });
    return { message: 'Category created successfully', data: category };
  }

  async findAll() {
    return {
      data: await this.prisma.productCategory.findMany({
        orderBy: { name: 'asc' },
      }),
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return { data: category };
  }

  async update(
    id: string,
    dto: Partial<{
      code: string;
      name: string;
      description: string;
      icon: string;
    }>,
  ) {
    await this.findOne(id);
    const category = await this.prisma.productCategory.update({
      where: { id },
      data: dto,
    });
    return { message: 'Category updated successfully', data: category };
  }

  async remove(id: string) {
    await this.findOne(id);
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0)
      throw new ConflictException(
        'Category still has products, cannot be deleted',
      );
    await this.prisma.productCategory.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
