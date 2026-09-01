import { Test, TestingModule } from '@nestjs/testing';

import { PublicCartService } from './public-cart.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PublicCartService', () => {
  let service: PublicCartService;
  let prisma: { cartItem: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { cartItem: { findMany: jest.fn(), findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicCartService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PublicCartService>(PublicCartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns every cart item wrapped in { data }, no auth scoping', async () => {
    const items = [{ id: 1, userId: 1 }, { id: 2, userId: 2 }];
    prisma.cartItem.findMany.mockResolvedValue(items);

    const result = await service.findAll();

    expect(result).toEqual({ data: items });
  });

  it('findOne returns { data: null } when the item does not exist (never throws)', async () => {
    prisma.cartItem.findUnique.mockResolvedValue(null);

    const result = await service.findOne(999);

    expect(result).toEqual({ data: null });
  });

  it('findOne returns the item wrapped in { data } when it exists', async () => {
    const item = { id: 1, userId: 1 };
    prisma.cartItem.findUnique.mockResolvedValue(item);

    const result = await service.findOne(1);

    expect(result).toEqual({ data: item });
  });
});
