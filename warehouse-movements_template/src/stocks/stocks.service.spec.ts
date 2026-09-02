import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StocksService', () => {
  let service: StocksService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      stock: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      movement: { create: jest.fn() },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StocksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StocksService>(StocksService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('adjust', () => {
    it('throws NotFoundException when stock does not exist', async () => {
      prisma.stock.findUnique.mockResolvedValue(null);
      await expect(service.adjust('missing', { quantity: 10, type: 'ADJUSTMENT' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('rejects when the adjustment would make quantity negative', async () => {
      prisma.stock.findUnique.mockResolvedValue({ id: 'stock-1', quantity: 5 });
      await expect(service.adjust('stock-1', { quantity: -10, type: 'SALE' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('creates a Movement record and updates quantity in a transaction', async () => {
      prisma.stock.findUnique.mockResolvedValue({ id: 'stock-1', quantity: 5 });
      prisma.$transaction.mockResolvedValue([{ id: 'stock-1', quantity: 15 }]);

      const result = await service.adjust('stock-1', { quantity: 10, type: 'PURCHASE' });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.message).toBe('Stock adjusted successfully');
    });
  });
});
