import { Test, TestingModule } from '@nestjs/testing';

import { StatsService } from './stats.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: {
    product: { count: jest.Mock; findFirst: jest.Mock };
    category: { count: jest.Mock };
    productImage: { count: jest.Mock };
    review: { count: jest.Mock; aggregate: jest.Mock; findFirst: jest.Mock };
    order: { count: jest.Mock; findFirst: jest.Mock };
    favorite: { count: jest.Mock };
    payment: { count: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      product: {
        count: jest.fn((args?: any) =>
          Promise.resolve(args?.where?.isActive ? 40 : 100),
        ),
        findFirst: jest.fn().mockResolvedValue({ createdAt: new Date('2026-01-01') }),
      },
      category: { count: jest.fn().mockResolvedValue(5) },
      productImage: { count: jest.fn().mockResolvedValue(20) },
      review: {
        count: jest.fn().mockResolvedValue(15),
        aggregate: jest.fn().mockResolvedValue({ _avg: { rating: 4.5 } }),
        findFirst: jest.fn().mockResolvedValue({ createdAt: new Date('2026-01-02') }),
      },
      order: {
        count: jest.fn((args?: any) => {
          const status = args?.where?.status;
          if (status === 'PENDING') return Promise.resolve(3);
          if (status === 'COMPLETED') return Promise.resolve(25);
          if (status === 'CANCELLED') return Promise.resolve(2);
          return Promise.resolve(30);
        }),
        findFirst: jest.fn().mockResolvedValue({ createdAt: new Date('2026-01-03') }),
      },
      favorite: { count: jest.fn().mockResolvedValue(12) },
      payment: {
        count: jest.fn((args?: any) => {
          const status = args?.where?.status;
          if (status === 'SUCCESS') return Promise.resolve(18);
          if (status === 'FAILED') return Promise.resolve(2);
          return Promise.resolve(20);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('aggregates counts from every model into a single flat stats report', async () => {
    const result = await service.getStats();

    expect(result.application).toEqual({ name: 'Kings Brew', type: 'COFFEE' });

    expect(result.products).toEqual({ total: 100, active: 40, inactive: 60 });
    expect(result.categories).toEqual({ total: 5 });
    expect(result.images).toEqual({ total: 20 });
    expect(result.reviews).toEqual({ total: 15, averageRating: 4.5 });
    expect(result.orders).toEqual({
      total: 30,
      pending: 3,
      completed: 25,
      cancelled: 2,
    });
    expect(result.payments).toEqual({ total: 20, success: 18, failed: 2 });
    expect(result.favorites).toEqual({ total: 12 });

    expect(result.latest.product).toEqual(new Date('2026-01-01'));
    expect(result.latest.review).toEqual(new Date('2026-01-02'));
    expect(result.latest.order).toEqual(new Date('2026-01-03'));
  });

  it('falls back to averageRating 0 when there are no reviews yet', async () => {
    prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });

    const result = await service.getStats();

    expect(result.reviews.averageRating).toBe(0);
  });

  it('falls back to null "latest" timestamps when a model has no rows yet', async () => {
    prisma.product.findFirst.mockResolvedValue(null);
    prisma.review.findFirst.mockResolvedValue(null);
    prisma.order.findFirst.mockResolvedValue(null);

    const result = await service.getStats();

    expect(result.latest).toEqual({ product: null, review: null, order: null });
  });
});
