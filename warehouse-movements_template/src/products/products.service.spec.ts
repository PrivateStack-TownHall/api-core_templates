import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      product: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('rejects duplicate SKU', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.create({
          categoryId: 'cat-1',
          sku: 'SKU-001',
          name: 'Mouse',
          unit: 'pcs',
          costPrice: 50000,
          sellingPrice: 75000,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes the product', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1' });
      const result = await service.remove('prod-1');
      expect(prisma.product.delete).toHaveBeenCalled();
      expect(result.message).toBe('Product deleted successfully');
    });
  });
});
