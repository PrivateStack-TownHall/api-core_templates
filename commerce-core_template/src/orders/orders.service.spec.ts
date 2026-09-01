import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: {
    cartItem: { findMany: jest.Mock; deleteMany: jest.Mock };
    order: { findFirst: jest.Mock; findMany: jest.Mock; update: jest.Mock };
    orderItem: { create: jest.Mock };
    product: { update: jest.Mock };
    orderStatusHistory: { create: jest.Mock };
    $transaction: jest.Mock;
  };
  let auditLogsService: { create: jest.Mock };

  beforeEach(async () => {
    prisma = {
      cartItem: { findMany: jest.fn(), deleteMany: jest.fn() },
      order: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn() },
      orderItem: { create: jest.fn() },
      product: { update: jest.fn() },
      orderStatusHistory: { create: jest.fn() },
      // Runs the passed callback against a "tx" object backed by the same
      // mocked models, so nested calls (tx.order.create, etc.) are inspectable.
      $transaction: jest.fn(),
    };
    auditLogsService = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    it('throws BadRequestException when the cart is empty', async () => {
      prisma.cartItem.findMany.mockResolvedValue([]);

      await expect(service.checkout(1)).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when stock is insufficient for an item', async () => {
      prisma.cartItem.findMany.mockResolvedValue([
        {
          productId: 1,
          quantity: 5,
          product: { id: 1, name: 'Espresso', price: '25000', stock: 1 },
        },
      ]);

      await expect(service.checkout(1)).rejects.toThrow(BadRequestException);
    });

    it('creates the order in a transaction and returns { message, data }', async () => {
      prisma.cartItem.findMany.mockResolvedValue([
        {
          productId: 1,
          quantity: 2,
          product: { id: 1, name: 'Espresso', price: '25000', stock: 10 },
        },
      ]);

      const createdOrder = { id: 1, orderNumber: 'KB-1', totalAmount: 50000 };

      prisma.$transaction.mockImplementation(async (callback: any) => {
        const tx = {
          order: { create: jest.fn().mockResolvedValue(createdOrder) },
          orderItem: { create: jest.fn().mockResolvedValue({ id: 1 }) },
          product: { update: jest.fn().mockResolvedValue({}) },
          orderStatusHistory: { create: jest.fn().mockResolvedValue({}) },
          cartItem: { deleteMany: jest.fn().mockResolvedValue({}) },
        };
        return callback(tx);
      });

      const result = await service.checkout(1);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Checkout successful', data: createdOrder });
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CHECKOUT' }),
      );
    });
  });

  describe('findAll', () => {
    it('returns { data } with totalAmount converted to Number, scoped to the user', async () => {
      prisma.order.findMany.mockResolvedValue([{ id: 1, totalAmount: '50000' }]);

      const result = await service.findAll(1);

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: 1 }) }),
      );
      expect(result.data[0].totalAmount).toBe(50000);
    });
  });

  describe('findOne', () => {
    it('returns { data } for an order owned by the user', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1, totalAmount: '50000' });

      const result = await service.findOne(1, 1);

      expect(result.data.totalAmount).toBe(50000);
    });

    it('throws NotFoundException when the order does not belong to the user', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates status, records history + audit log, and returns { message, data }', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      prisma.order.update.mockResolvedValue({
        id: 1,
        status: 'PROCESSING',
        totalAmount: '50000',
      });

      const result = await service.updateStatus(1, {
        status: 'PROCESSING',
        notes: 'moving along',
      } as any);

      expect(prisma.orderStatusHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ orderId: 1, status: 'PROCESSING' }),
        }),
      );
      expect(result.message).toBe('Order status updated successfully');
      // Regression guard: this endpoint used to return { message } only,
      // silently dropping `data` even though Swagger documents it.
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(1);
      expect(result.data.status).toBe('PROCESSING');
      expect(result.data.totalAmount).toBe(50000);
    });

    it('throws NotFoundException when the order does not exist', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, { status: 'PAID' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.order.update).not.toHaveBeenCalled();
    });
  });
});
