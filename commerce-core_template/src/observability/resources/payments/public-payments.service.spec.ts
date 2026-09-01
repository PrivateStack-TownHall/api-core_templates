import { Test, TestingModule } from '@nestjs/testing';

import { PublicPaymentsService } from './public-payments.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PublicPaymentsService', () => {
  let service: PublicPaymentsService;
  let prisma: { payment: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { payment: { findMany: jest.fn(), findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicPaymentsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PublicPaymentsService>(PublicPaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns every payment wrapped in { data }, no auth scoping', async () => {
    const payments = [{ id: 1, orderId: 1 }, { id: 2, orderId: 2 }];
    prisma.payment.findMany.mockResolvedValue(payments);

    const result = await service.findAll();

    expect(result).toEqual({ data: payments });
  });

  it('findOne returns { data: null } when the payment does not exist', async () => {
    prisma.payment.findUnique.mockResolvedValue(null);

    const result = await service.findOne(999);

    expect(result).toEqual({ data: null });
  });

  it('findOne returns the payment wrapped in { data } when it exists', async () => {
    const payment = { id: 1, orderId: 1 };
    prisma.payment.findUnique.mockResolvedValue(payment);

    const result = await service.findOne(1);

    expect(result).toEqual({ data: payment });
  });
});
