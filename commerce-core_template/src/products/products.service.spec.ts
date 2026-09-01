import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: {
    product: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a product, converts Decimal price to Number, and wraps { message, data }', async () => {
      prisma.product.create.mockResolvedValue({
        id: 1,
        name: 'Espresso',
        price: '25000', // Prisma Decimal often serializes like a string
        stock: 10,
      });

      const result = await service.create({
        categoryId: 1,
        name: 'Espresso',
        price: 25000,
        stock: 10,
      } as any);

      expect(result.message).toBe('Coffee created successfully');
      expect(result.data.price).toBe(25000);
      expect(typeof result.data.price).toBe('number');
    });

    it('defaults isActive to true when not provided', async () => {
      prisma.product.create.mockResolvedValue({ id: 1, price: '1000' });

      await service.create({ categoryId: 1, name: 'X', price: 1000, stock: 1 } as any);

      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isActive: true, appType: 'COFFEE' }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('returns paginated { meta, data } with prices converted to Number', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 1, price: '25000' }]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 } as any);

      expect(result.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
      expect(result.data[0].price).toBe(25000);
    });

    it('defaults page/limit when not provided', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      const result = await service.findAll({} as any);

      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(0);
    });

    it('applies search filter as case-insensitive contains', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ search: 'latte' } as any);

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: 'latte', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('returns { data } with price converted to Number', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, price: '25000' });

      const result = await service.findOne(1);

      expect(result).toEqual({ data: { id: 1, price: 25000 } });
    });

    it('throws NotFoundException when product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns { message, data }', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, price: '25000' });
      prisma.product.update.mockResolvedValue({ id: 1, price: '30000', name: 'New' });

      const result = await service.update(1, { name: 'New' } as any);

      expect(result.message).toBe('Coffee updated successfully');
      expect(result.data.price).toBe(30000);
    });

    it('throws NotFoundException before updating when product is missing', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes and returns only { message }', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 1, price: '25000' });
      prisma.product.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Coffee deleted successfully' });
    });

    it('throws NotFoundException before deleting when product is missing', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(prisma.product.delete).not.toHaveBeenCalled();
    });
  });
});
