import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditLogsService', () => {
  let service: AuditLogsService;
  let prisma: { auditLog: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock } };

  beforeEach(async () => {
    prisma = { auditLog: { findMany: jest.fn(), findFirst: jest.fn(), create: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('filters by appType PINEAPPLE', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      await service.findAll();
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { appType: 'PINEAPPLE' } }),
      );
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when log does not exist', async () => {
      prisma.auditLog.findFirst.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });

    it('returns the log when found', async () => {
      prisma.auditLog.findFirst.mockResolvedValue({ id: 'log-1' });
      const result = await service.findOne('log-1');
      expect(result.data.id).toBe('log-1');
    });
  });

  describe('findByUser', () => {
    it('filters by userId and appType', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      await service.findByUser('user-1');
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1', appType: 'PINEAPPLE' } }),
      );
    });
  });

  describe('create', () => {
    it('always tags the log with appType PINEAPPLE', async () => {
      prisma.auditLog.create.mockResolvedValue({ id: 'log-1' });
      await service.create({ userId: 'user-1', action: 'LOGIN', entity: 'User' });
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ appType: 'PINEAPPLE' }),
      });
    });
  });
});
