import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductCategoriesService', () => {
  let service: ProductCategoriesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      productCategory: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      product: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCategoriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ProductCategoriesService>(ProductCategoriesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('rejects duplicate category code', async () => {
      prisma.productCategory.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(service.create({ code: 'ELEC', name: 'Electronics' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates the category when code is unique', async () => {
      prisma.productCategory.findUnique.mockResolvedValue(null);
      prisma.productCategory.create.mockResolvedValue({ id: 'cat-1' });
      const result = await service.create({ code: 'ELEC', name: 'Electronics' });
      expect(result.message).toBe('Category created successfully');
    });
  });

  describe('remove', () => {
    it('throws ConflictException when category still has products', async () => {
      prisma.productCategory.findUnique.mockResolvedValue({ id: 'cat-1' });
      prisma.product.count.mockResolvedValue(5);
      await expect(service.remove('cat-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when category does not exist', async () => {
      prisma.productCategory.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
