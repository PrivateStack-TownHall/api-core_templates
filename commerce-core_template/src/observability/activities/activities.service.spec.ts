import { Test, TestingModule } from '@nestjs/testing';

import { ActivitiesService } from './activities.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let prisma: {
    product: { findMany: jest.Mock };
    category: { findMany: jest.Mock };
    productImage: { findMany: jest.Mock };
    review: { findMany: jest.Mock };
    order: { findMany: jest.Mock };
    payment: { findMany: jest.Mock };
    favorite: { findMany: jest.Mock };
  };

  const empty = () => Promise.resolve([]);

  beforeEach(async () => {
    prisma = {
      product: { findMany: jest.fn(empty) },
      category: { findMany: jest.fn(empty) },
      productImage: { findMany: jest.fn(empty) },
      review: { findMany: jest.fn(empty) },
      order: { findMany: jest.fn(empty) },
      payment: { findMany: jest.fn(empty) },
      favorite: { findMany: jest.fn(empty) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitiesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns an empty array when nothing has happened yet', async () => {
    const result = await service.getActivities();

    expect(result).toEqual([]);
  });

  it('merges every source into one feed, newest first, capped at 30 items', async () => {
    prisma.product.findMany.mockResolvedValue([
      { id: 1, name: 'Espresso', createdAt: new Date('2026-01-01T10:00:00Z') },
    ]);
    prisma.order.findMany.mockResolvedValue([
      { id: 1, status: 'PENDING', createdAt: new Date('2026-01-02T10:00:00Z') },
    ]);
    prisma.review.findMany.mockResolvedValue([
      {
        id: 1,
        rating: 5,
        comment: 'Great!',
        createdAt: new Date('2026-01-03T10:00:00Z'),
      },
    ]);

    const result = await service.getActivities();

    expect(result).toHaveLength(3);
    // Newest first.
    expect(result[0].type).toBe('REVIEW_CREATED');
    expect(result[1].type).toBe('ORDER_CREATED');
    expect(result[2].type).toBe('PRODUCT_CREATED');
    expect(result[0].application).toBe('Kings Brew');
  });
});
