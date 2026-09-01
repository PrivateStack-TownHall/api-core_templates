import { Injectable, NotFoundException } from '@nestjs/common';

import { AppType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        appType: AppType.COFFEE,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        isActive: dto.isActive ?? true,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return {
      message: 'Coffee created successfully',
      data: {
        ...product,
        price: Number(product.price),
      },
    };
  }

  async findAll(query: QueryProductDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where: any = { appType: AppType.COFFEE };
    const orderBy: any = {};

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (query.categoryId) {
      where.categoryId = Number(query.categoryId);
    }

    if (query.sort) {
      orderBy[query.sort] = query.order || 'asc';
    }

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,

      include: {
        category: true,
        images: true,
      },

      orderBy:
        Object.keys(orderBy).length > 0
          ? orderBy
          : {
              id: 'desc',
            },
    });

    const total = await this.prisma.product.count({
      where,
    });

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: products.map((product) => ({
        ...product,
        price: Number(product.price),
      })),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        appType: AppType.COFFEE,
      },

      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Coffee not found');
    }

    return {
      data: {
        ...product,
        price: Number(product.price),
      },
    };
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: {
        id,
        appType: AppType.COFFEE,
      },
      data: dto,

      include: {
        category: true,
        images: true,
      },
    });

    return {
      message: 'Coffee updated successfully',
      data: {
        ...product,
        price: Number(product.price),
      },
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Coffee deleted successfully',
    };
  }
}
