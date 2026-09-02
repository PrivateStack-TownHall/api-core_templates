import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';

import { TransfersService } from './transfers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TransfersService', () => {
  let service: TransfersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      transfer: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      stock: { findUnique: jest.fn(), update: jest.fn(), upsert: jest.fn() },
      movement: { create: jest.fn() },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('rejects when fromWarehouseId equals toWarehouseId', async () => {
      await expect(
        service.create({
          code: 'TRF-001',
          fromWarehouseId: 'wh-1',
          toWarehouseId: 'wh-1',
          items: [{ productId: 'prod-1', quantity: 5 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when transfer code already exists', async () => {
      prisma.transfer.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create({
          code: 'TRF-001',
          fromWarehouseId: 'wh-1',
          toWarehouseId: 'wh-2',
          items: [{ productId: 'prod-1', quantity: 5 }],
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateStatus', () => {
    it('rejects insufficient stock when completing transfer', async () => {
      prisma.transfer.findUnique.mockResolvedValue({
        id: 'transfer-1',
        status: 'PENDING',
        fromWarehouseId: 'wh-1',
        toWarehouseId: 'wh-2',
        code: 'TRF-001',
        items: [{ productId: 'prod-1', quantity: 100 }],
      });
      prisma.stock.findUnique.mockResolvedValue({
        id: 'stock-1',
        quantity: 10,
      });

      await expect(
        service.updateStatus('transfer-1', { status: 'COMPLETED' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects changing status of an already-completed transfer', async () => {
      prisma.transfer.findUnique.mockResolvedValue({
        id: 'transfer-1',
        status: 'COMPLETED',
      });

      await expect(
        service.updateStatus('transfer-1', { status: 'CANCELLED' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
