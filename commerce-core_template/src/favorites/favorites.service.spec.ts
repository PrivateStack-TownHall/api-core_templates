import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let prisma: {
    favorite: {
      findFirst: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      favorite: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('adds a favorite and returns { message, data }', async () => {
      prisma.favorite.findFirst.mockResolvedValue(null);
      const favorite = { id: 1, userId: 1, productId: 1 };
      prisma.favorite.create.mockResolvedValue(favorite);

      const result = await service.create(1, 1);

      expect(result).toEqual({
        message: 'Favorite added successfully',
        data: favorite,
      });
    });

    it('throws BadRequestException when already favorited', async () => {
      prisma.favorite.findFirst.mockResolvedValue({ id: 1 });

      await expect(service.create(1, 1)).rejects.toThrow(BadRequestException);
      expect(prisma.favorite.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns { data } scoped to the current user', async () => {
      const favorites = [{ id: 1, userId: 1, productId: 1 }];
      prisma.favorite.findMany.mockResolvedValue(favorites);

      const result = await service.findAll(1);

      expect(prisma.favorite.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 }),
        }),
      );
      expect(result).toEqual({ data: favorites });
    });
  });

  describe('remove', () => {
    it('deletes and returns only { message }', async () => {
      prisma.favorite.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      prisma.favorite.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1, 1);

      expect(result).toEqual({ message: 'Favorite removed successfully' });
    });

    it('throws NotFoundException when the favorite does not belong to the user / does not exist', async () => {
      prisma.favorite.findFirst.mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
      expect(prisma.favorite.delete).not.toHaveBeenCalled();
    });
  });
});
