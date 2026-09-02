import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      book: {
        count: jest.fn().mockResolvedValue(0),
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalCopies: 0 } }),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      author: { count: jest.fn().mockResolvedValue(0) },
      publisher: { count: jest.fn().mockResolvedValue(0) },
      genre: { count: jest.fn().mockResolvedValue(0) },
      review: {
        count: jest.fn().mockResolvedValue(0),
        aggregate: jest.fn().mockResolvedValue({ _avg: { rating: null } }),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      user: { count: jest.fn().mockResolvedValue(0) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('assembles the full stats payload', async () => {
    prisma.book.count.mockResolvedValue(15);
    prisma.book.aggregate.mockResolvedValue({ _sum: { totalCopies: 45 } });
    prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.3 } });

    const result = await service.getStats();

    expect(result.application.name).toBe('Leather Shelf');
    expect(result.books).toEqual({ total: 15, totalCopies: 45 });
    expect(result.reviews.averageRating).toBe(4.3);
  });

  it('falls back to 0 average rating when there are no reviews', async () => {
    const result = await service.getStats();
    expect(result.reviews.averageRating).toBe(0);
  });
});
