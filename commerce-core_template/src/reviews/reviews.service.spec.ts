import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    review: {
      findFirst: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      review: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a review and returns { message, data }', async () => {
      prisma.review.findFirst.mockResolvedValue(null);
      const review = { id: 1, userId: 1, productId: 1, rating: 5 };
      prisma.review.create.mockResolvedValue(review);

      const result = await service.create(1, {
        productId: 1,
        rating: 5,
        comment: 'Great!',
      } as any);

      expect(result).toEqual({
        message: 'Review created successfully',
        data: review,
      });
    });

    it('throws BadRequestException when user already reviewed the product', async () => {
      prisma.review.findFirst.mockResolvedValue({ id: 1 });

      await expect(
        service.create(1, { productId: 1, rating: 5 } as any),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.review.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns all reviews wrapped in { data }', async () => {
      const reviews = [{ id: 1, rating: 5 }];
      prisma.review.findMany.mockResolvedValue(reviews);

      const result = await service.findAll();

      expect(result).toEqual({ data: reviews });
    });
  });

  describe('findByProduct', () => {
    it('returns reviews for a specific product wrapped in { data }', async () => {
      const reviews = [{ id: 1, productId: 1, rating: 4 }];
      prisma.review.findMany.mockResolvedValue(reviews);

      const result = await service.findByProduct(1);

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ productId: 1 }),
        }),
      );
      expect(result).toEqual({ data: reviews });
    });
  });

  describe('update', () => {
    it('updates and returns { message, data }', async () => {
      prisma.review.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      const updated = { id: 1, rating: 3 };
      prisma.review.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { rating: 3 } as any);

      expect(result).toEqual({
        message: 'Review updated successfully',
        data: updated,
      });
    });

    it('throws NotFoundException when review does not belong to the user', async () => {
      prisma.review.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.review.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes and returns only { message }', async () => {
      prisma.review.findFirst.mockResolvedValue({ id: 1, userId: 1 });
      prisma.review.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1, 1);

      expect(result).toEqual({ message: 'Review deleted successfully' });
    });

    it('throws NotFoundException when review does not belong to the user', async () => {
      prisma.review.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
      expect(prisma.review.delete).not.toHaveBeenCalled();
    });
  });
});
