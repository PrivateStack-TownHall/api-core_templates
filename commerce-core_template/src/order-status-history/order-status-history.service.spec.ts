import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { OrderStatusHistoryService } from './order-status-history.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrderStatusHistoryService', () => {
  let service: OrderStatusHistoryService;
  let prisma: {
    orderStatusHistory: { findMany: jest.Mock; findFirst: jest.Mock };
    order: { findFirst: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      orderStatusHistory: { findMany: jest.fn(), findFirst: jest.fn() },
      order: { findFirst: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderStatusHistoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<OrderStatusHistoryService>(OrderStatusHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all histories wrapped in { data }', async () => {
      const histories = [{ id: 1, status: 'PENDING' }];
      prisma.orderStatusHistory.findMany.mockResolvedValue(histories);

      const result = await service.findAll();

      expect(result).toEqual({ data: histories });
    });
  });

  describe('findByOrder', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(service.findByOrder(999)).rejects.toThrow(NotFoundException);
    });

    it('returns { data } for the order history when the order exists', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1 });
      const histories = [{ id: 1, orderId: 1, status: 'PENDING' }];
      prisma.orderStatusHistory.findMany.mockResolvedValue(histories);

      const result = await service.findByOrder(1);

      expect(result).toEqual({ data: histories });
    });
  });

  describe('findOne', () => {
    it('returns { data } for an existing history entry', async () => {
      const history = { id: 1, status: 'PENDING' };
      prisma.orderStatusHistory.findFirst.mockResolvedValue(history);

      const result = await service.findOne(1);

      expect(result).toEqual({ data: history });
    });

    it('throws NotFoundException when the history entry does not exist', async () => {
      prisma.orderStatusHistory.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
