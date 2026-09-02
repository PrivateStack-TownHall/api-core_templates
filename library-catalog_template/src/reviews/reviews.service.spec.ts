import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    book: { findUnique: jest.Mock };
    review: {
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      book: { findUnique: jest.fn() },
      review: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when book does not exist', async () => {
      prisma.book.findUnique.mockResolvedValue(null);
      await expect(
        service.create('missing-book', 'user-1', { rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when user already reviewed the book', async () => {
      prisma.book.findUnique.mockResolvedValue({ id: 'book-1' });
      prisma.review.findUnique.mockResolvedValue({ id: 'existing-review' });

      await expect(
        service.create('book-1', 'user-1', { rating: 5 }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates a review when none exists yet', async () => {
      prisma.book.findUnique.mockResolvedValue({ id: 'book-1' });
      prisma.review.findUnique.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({ id: 'review-1', rating: 5 });

      const result = await service.create('book-1', 'user-1', {
        rating: 5,
        comment: 'Great!',
      });
      expect(result.message).toBe('Review added successfully');
    });
  });

  describe('update', () => {
    it('throws ForbiddenException for non-owner non-admin', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'review-1',
        userId: 'owner-1',
      });

      await expect(
        service.update('review-1', 'other-user', 'MEMBER' as any, {
          rating: 3,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
