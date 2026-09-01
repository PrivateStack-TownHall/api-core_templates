import { Injectable, NotFoundException } from '@nestjs/common';

import { AppType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductImageDto) {
    const image = await this.prisma.productImage.create({
      data: {
        productId: dto.productId,
        imageUrl: dto.imageUrl,
        sortOrder: dto.sortOrder ?? 0,
      },

      include: {
        product: true,
      },
    });

    return {
      message: 'Coffee image created successfully',

      data: image,
    };
  }

  async findAll() {
    return {
      data: await this.prisma.productImage.findMany({
        where: {
          product: {
            appType: AppType.COFFEE,
          },
        },

        include: {
          product: true,
        },

        orderBy: {
          sortOrder: 'asc',
        },
      }),
    };
  }

  async findOne(id: number) {
    const image = await this.prisma.productImage.findFirst({
      where: {
        id,

        product: {
          appType: AppType.COFFEE,
        },
      },

      include: {
        product: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Coffee image not found');
    }

    return {
      data: image,
    };
  }

  async update(id: number, dto: UpdateProductImageDto) {
    await this.findOne(id);

    const image = await this.prisma.productImage.update({
      where: {
        id,
      },

      data: dto,

      include: {
        product: true,
      },
    });

    return {
      message: 'Coffee image updated successfully',

      data: image,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.productImage.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Coffee image deleted successfully',
    };
  }
}
