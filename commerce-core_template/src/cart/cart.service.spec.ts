import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('CartService', () => {
  let service: CartService;
  let prisma: {
    product: { findFirst: jest.Mock };
    cartItem: {
      findFirst: jest.Mock;
      update: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      delete: jest.Mock;
    };
  };
  let auditLogsService: { create: jest.Mock };

  beforeEach(async () => {
    prisma = {
      product: { findFirst: jest.fn() },
      cartItem: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };
    auditLogsService = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('throws NotFoundException when the product does not exist', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(
        service.create(1, { productId: 1, quantity: 1 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when stock is insufficient', async () => {
      prisma.product.findFirst.mockResolvedValue({ id: 1, stock: 1 });

      await expect(
        service.create(1, { productId: 1, quantity: 5 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('increments quantity and returns "Cart updated successfully" when the item already exists in cart', async () => {
      prisma.product.findFirst.mockResolvedValue({ id: 1, stock: 10 });
      prisma.cartItem.findFirst.mockResolvedValue({ id: 5, quantity: 2 });
      const updated = { id: 5, quantity: 5 };
      prisma.cartItem.update.mockResolvedValue(updated);

      const result = await service.create(1, { productId: 1, quantity: 3 } as any);

      expect(prisma.cartItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 5 },
          data: { quantity: 5 },
        }),
      );
      expect(result).toEqual({ message: 'Cart updated successfully', data: updated });
      expect(prisma.cartItem.create).not.toHaveBeenCalled();
    });

    it('creates a new cart item and logs an audit entry when not already in cart', async () => {
      prisma.product.findFirst.mockResolvedValue({ id: 1, stock: 10 });
      prisma.cartItem.findFirst.mockResolvedValue(null);
      const created = { id: 9, quantity: 2 };
      prisma.cartItem.create.mockResolvedValue(created);

      const result = await service.create(1, { productId: 1, quantity: 2 } as any);

      expect(result).toEqual({ message: 'Added to cart successfully', data: created });
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'ADD_TO_CART' }),
      );
    });
  });

  describe('findAll', () => {
    it('returns totalItems, totalAmount and { data } with numeric prices', async () => {
      prisma.cartItem.findMany.mockResolvedValue([
        { id: 1, quantity: 2, product: { price: '25000' } },
      ]);

      const result = await service.findAll(1);

      expect(result.totalItems).toBe(1);
      expect(result.totalAmount).toBe(50000);
      expect(result.data[0].product.price).toBe(25000);
    });
  });

  describe('findOne', () => {
    it('returns { data } for a cart item owned by the user', async () => {
      prisma.cartItem.findFirst.mockResolvedValue({
        id: 1,
        product: { price: '25000' },
      });

      const result = await service.findOne(1, 1);

      expect(result.data.product.price).toBe(25000);
    });

    it('throws NotFoundException when the item is not found', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates quantity and returns { message, data }', async () => {
      prisma.cartItem.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      const updated = { id: 1, quantity: 9 };
      prisma.cartItem.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { quantity: 9 } as any);

      expect(result).toEqual({ message: 'Cart updated successfully', data: updated });
    });

    it('throws NotFoundException when the item does not belong to the user', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.update(999, 1, { quantity: 1 } as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.cartItem.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes, logs an audit entry, and returns only { message }', async () => {
      prisma.cartItem.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      prisma.cartItem.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1, 1);

      expect(result).toEqual({ message: 'Cart item removed successfully' });
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'REMOVE_CART' }),
      );
    });

    it('throws NotFoundException when the item does not belong to the user', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
      expect(prisma.cartItem.delete).not.toHaveBeenCalled();
    });
  });
});
