import { Test, TestingModule } from '@nestjs/testing';

import { PublicOrderStatusHistoryService } from './public-order-status-history.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PublicOrderStatusHistoryService', () => {
  let service: PublicOrderStatusHistoryService;
  let prisma: { orderStatusHistory: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { orderStatusHistory: { findMany: jest.fn(), findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicOrderStatusHistoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PublicOrderStatusHistoryService>(
      PublicOrderStatusHistoryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns every history entry wrapped in { data }, no auth scoping', async () => {
    const histories = [{ id: 1, orderId: 1 }, { id: 2, orderId: 2 }];
    prisma.orderStatusHistory.findMany.mockResolvedValue(histories);

    const result = await service.findAll();

    expect(result).toEqual({ data: histories });
  });

  it('findOne returns { data: null } when the entry does not exist', async () => {
    prisma.orderStatusHistory.findUnique.mockResolvedValue(null);

    const result = await service.findOne(999);

    expect(result).toEqual({ data: null });
  });

  it('findOne returns the entry wrapped in { data } when it exists', async () => {
    const history = { id: 1, orderId: 1 };
    prisma.orderStatusHistory.findUnique.mockResolvedValue(history);

    const result = await service.findOne(1);

    expect(result).toEqual({ data: history });
  });
});
