import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PurchasesService', () => {
  let service: PurchasesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      purchase: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PurchasesService>(PurchasesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('rejects duplicate invoice number', async () => {
      prisma.purchase.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.create({
          supplierId: 'sup-1',
          invoice: 'INV-001',
          purchaseDate: '2026-01-01',
          items: [{ productId: 'prod-1', quantity: 1, price: 1000 }],
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('computes the total from items', async () => {
      prisma.purchase.findUnique.mockResolvedValue(null);
      prisma.purchase.create.mockResolvedValue({ id: 'purchase-1' });

      await service.create({
        supplierId: 'sup-1',
        invoice: 'INV-002',
        purchaseDate: '2026-01-01',
        items: [
          { productId: 'prod-1', quantity: 2, price: 1000 },
          { productId: 'prod-2', quantity: 3, price: 500 },
        ],
      });

      expect(prisma.purchase.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ total: 3500 }) }),
      );
    });
  });

  describe('updateStatus', () => {
    it('rejects changing status of an already-completed purchase', async () => {
      prisma.purchase.findUnique.mockResolvedValue({ id: 'purchase-1', status: 'COMPLETED' });
      await expect(service.updateStatus('purchase-1', { status: 'CANCELLED' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws NotFoundException when purchase does not exist', async () => {
      prisma.purchase.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('missing', { status: 'COMPLETED' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
