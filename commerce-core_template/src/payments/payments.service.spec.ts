import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: {
    order: { findFirst: jest.Mock; update: jest.Mock };
    payment: { findFirst: jest.Mock; create: jest.Mock; findMany: jest.Mock; update: jest.Mock };
    orderStatusHistory: { create: jest.Mock };
  };
  let auditLogsService: { create: jest.Mock };

  beforeEach(async () => {
    prisma = {
      order: { findFirst: jest.fn(), update: jest.fn() },
      payment: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      orderStatusHistory: { create: jest.fn() },
    };
    auditLogsService = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('throws NotFoundException when the order does not belong to the user', async () => {
      prisma.order.findFirst.mockResolvedValue(null);

      await expect(
        service.create(1, { orderId: 1, method: 'CASH' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when a payment already exists for the order', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1, totalAmount: '50000' });
      prisma.payment.findFirst.mockResolvedValue({ id: 1 });

      await expect(
        service.create(1, { orderId: 1, method: 'CASH' } as any),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.payment.create).not.toHaveBeenCalled();
    });

    it('creates a payment and returns { message, data } with amount as a Number', async () => {
      prisma.order.findFirst.mockResolvedValue({ id: 1, userId: 1, totalAmount: '50000' });
      prisma.payment.findFirst.mockResolvedValue(null);
      prisma.payment.create.mockResolvedValue({
        id: 1,
        orderId: 1,
        amount: '50000',
        order: { userId: 1 },
      });

      const result = await service.create(1, { orderId: 1, method: 'CASH' } as any);

      expect(result.message).toBe('Payment created successfully');
      expect(result.data.amount).toBe(50000);
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE_PAYMENT' }),
      );
    });
  });

  describe('findAll', () => {
    it('returns { data } scoped to the user with amount as a Number', async () => {
      prisma.payment.findMany.mockResolvedValue([{ id: 1, amount: '50000' }]);

      const result = await service.findAll(1);

      expect(prisma.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ order: expect.objectContaining({ userId: 1 }) }),
        }),
      );
      expect(result.data[0].amount).toBe(50000);
    });
  });

  describe('findOne', () => {
    it('returns { data } with amount as a Number', async () => {
      prisma.payment.findFirst.mockResolvedValue({ id: 1, amount: '50000' });

      const result = await service.findOne(1, 1);

      expect(result.data.amount).toBe(50000);
    });

    it('throws NotFoundException when the payment does not belong to the user', async () => {
      prisma.payment.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('marks the order PAID and logs a success audit entry when status becomes SUCCESS', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 1,
        orderId: 1,
        order: { userId: 1 },
      });
      prisma.payment.update.mockResolvedValue({
        id: 1,
        status: 'SUCCESS',
        amount: '50000',
        order: { userId: 1 },
      });

      const result = await service.updateStatus(1, { status: 'SUCCESS' } as any);

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'PAID' }) }),
      );
      expect(prisma.orderStatusHistory.create).toHaveBeenCalled();
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'PAYMENT_SUCCESS' }),
      );
      expect(result.data.amount).toBe(50000);
    });

    it('logs a failure audit entry and does NOT touch the order when status becomes FAILED', async () => {
      prisma.payment.findFirst.mockResolvedValue({
        id: 1,
        orderId: 1,
        order: { userId: 1 },
      });
      prisma.payment.update.mockResolvedValue({
        id: 1,
        status: 'FAILED',
        amount: '50000',
        order: { userId: 1 },
      });

      await service.updateStatus(1, { status: 'FAILED' } as any);

      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'PAYMENT_FAILED' }),
      );
    });

    it('throws NotFoundException when the payment does not exist', async () => {
      prisma.payment.findFirst.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, { status: 'SUCCESS' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.payment.update).not.toHaveBeenCalled();
    });
  });
});
