import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: {
    category: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a category and wraps it in { message, data }', async () => {
      const created = { id: 1, appType: 'COFFEE', name: 'Coffee', description: 'desc' };
      prisma.category.create.mockResolvedValue(created);

      const result = await service.create({ name: 'Coffee', description: 'desc' } as any);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: { appType: 'COFFEE', name: 'Coffee', description: 'desc' },
      });
      expect(result).toEqual({
        message: 'Coffee category created successfully',
        data: created,
      });
    });
  });

  describe('findAll', () => {
    it('returns categories wrapped in { data }', async () => {
      const categories = [{ id: 1, name: 'Coffee' }];
      prisma.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual({ data: categories });
    });

    it('returns { data: [] } when there are no categories (never a bare array)', async () => {
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual({ data: [] });
      expect(Array.isArray(result)).toBe(false);
    });
  });

  describe('findOne', () => {
    it('returns the category wrapped in { data }', async () => {
      const category = { id: 1, name: 'Coffee' };
      prisma.category.findUnique.mockResolvedValue(category);

      const result = await service.findOne(1);

      expect(result).toEqual({ data: category });
    });

    it('throws NotFoundException when category does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns { message, data }', async () => {
      prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Coffee' });
      const updated = { id: 1, name: 'Updated' };
      prisma.category.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Updated' } as any);

      expect(result).toEqual({
        message: 'Coffee category updated successfully',
        data: updated,
      });
    });

    it('throws NotFoundException before updating when category is missing', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'x' } as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.category.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes and returns only { message }', async () => {
      prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Coffee' });
      prisma.category.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Coffee category deleted successfully' });
    });

    it('throws NotFoundException before deleting when category is missing', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });
  });
});
