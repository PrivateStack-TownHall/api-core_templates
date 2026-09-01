import { Test, TestingModule } from '@nestjs/testing';

import { PublicOrdersService } from './public-orders.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PublicOrdersService', () => {
  let service: PublicOrdersService;
  let prisma: { order: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { order: { findMany: jest.fn(), findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicOrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PublicOrdersService>(PublicOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns every order wrapped in { data }, no auth scoping', async () => {
    const orders = [{ id: 1, userId: 1 }, { id: 2, userId: 2 }];
    prisma.order.findMany.mockResolvedValue(orders);

    const result = await service.findAll();

    expect(result).toEqual({ data: orders });
  });

  it('findOne returns { data: null } when the order does not exist', async () => {
    prisma.order.findUnique.mockResolvedValue(null);

    const result = await service.findOne(999);

    expect(result).toEqual({ data: null });
  });

  it('findOne returns the order wrapped in { data } when it exists', async () => {
    const order = { id: 1, userId: 1 };
    prisma.order.findUnique.mockResolvedValue(order);

    const result = await service.findOne(1);

    expect(result).toEqual({ data: order });
  });
});
