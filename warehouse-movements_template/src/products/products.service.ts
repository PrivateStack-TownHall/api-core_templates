import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = { category: true, brand: true };

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existing) throw new ConflictException('SKU already exists');

    const product = await this.prisma.product.create({
      data: dto,
      include: this.include,
    });
    return { message: 'Product created successfully', data: product };
  }

  async findAll(query: QueryProductDto) {
    const where: Prisma.ProductWhereInput = {};
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    const products = await this.prisma.product.findMany({
      where,
      include: this.include,
      orderBy: { name: 'asc' },
    });
    return { data: products };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        ...this.include,
        stocks: { include: { warehouse: true, location: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return { data: product };
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: this.include,
    });
    return { message: 'Product updated successfully', data: product };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}
