import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(userId: number, dto: CreateCartDto) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.productId,
        appType: AppType.COFFEE,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId: dto.productId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (existingItem) {
      const cart = await this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity: existingItem.quantity + dto.quantity,
        },

        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
        },
      });

      return {
        message: 'Cart updated successfully',

        data: cart,
      };
    }

    const cart = await this.prisma.cartItem.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },

      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });

    await this.auditLogsService.create({
      userId,
      action: 'ADD_TO_CART',
      entity: 'CartItem',
      entityId: cart.id.toString(),
      newData: cart,
    });

    return {
      message: 'Added to cart successfully',

      data: cart,
    };
  }

  async findAll(userId: number) {
    const items = await this.prisma.cartItem.findMany({
      where: {
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },

      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },

      orderBy: {
        id: 'desc',
      },
    });

    const totalAmount = items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      totalItems: items.length,
      totalAmount,

      data: items.map((item) => ({
        ...item,

        product: {
          ...item.product,

          price: Number(item.product.price),
        },
      })),
    };
  }

  async findOne(id: number, userId: number) {
    const cart = await this.prisma.cartItem.findFirst({
      where: {
        id,
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },

      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    return {
      data: {
        ...cart,

        product: {
          ...cart.product,

          price: Number(cart.product.price),
        },
      },
    };
  }

  async update(id: number, userId: number, dto: UpdateCartDto) {
    const cart = await this.prisma.cartItem.findFirst({
      where: {
        id,
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    const updatedCart = await this.prisma.cartItem.update({
      where: {
        id,
      },

      data: {
        quantity: dto.quantity,
      },

      include: {
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });

    await this.auditLogsService.create({
      userId,
      action: 'UPDATE_CART',
      entity: 'CartItem',
      entityId: updatedCart.id.toString(),
      newData: updatedCart,
    });

    return {
      message: 'Cart updated successfully',

      data: updatedCart,
    };
  }

  async remove(id: number, userId: number) {
    const cart = await this.prisma.cartItem.findFirst({
      where: {
        id,
        userId,

        product: {
          appType: AppType.COFFEE,
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    await this.auditLogsService.create({
      userId,
      action: 'REMOVE_CART',
      entity: 'CartItem',
      entityId: cart.id.toString(),
      oldData: cart,
    });

    await this.prisma.cartItem.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Cart item removed successfully',
    };
  }
}
