import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { AuditLogsService } from './audit-logs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditLogsService', () => {
  let service: AuditLogsService;
  let prisma: {
    auditLog: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      auditLog: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all audit logs wrapped in { data }', async () => {
      const logs = [{ id: 1, action: 'LOGIN' }];
      prisma.auditLog.findMany.mockResolvedValue(logs);

      const result = await service.findAll();

      expect(result).toEqual({ data: logs });
    });
  });

  describe('findOne', () => {
    it('returns { data } for an existing log', async () => {
      const log = { id: 1, action: 'LOGIN' };
      prisma.auditLog.findUnique.mockResolvedValue(log);

      const result = await service.findOne(1);

      expect(result).toEqual({ data: log });
    });

    it('throws NotFoundException when the log does not exist', async () => {
      prisma.auditLog.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('returns logs for a specific user wrapped in { data }', async () => {
      const logs = [{ id: 1, userId: 1, action: 'LOGIN' }];
      prisma.auditLog.findMany.mockResolvedValue(logs);

      const result = await service.findByUser(1);

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 1 } }),
      );
      expect(result).toEqual({ data: logs });
    });
  });

  describe('create', () => {
    it('creates a raw audit log entry (internal use, no HTTP wrapper needed)', async () => {
      const log = { id: 1, action: 'REGISTER' };
      prisma.auditLog.create.mockResolvedValue(log);

      const result = await service.create({
        userId: 1,
        action: 'REGISTER',
        entity: 'User',
      });

      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: { userId: 1, action: 'REGISTER', entity: 'User' },
      });
      expect(result).toEqual(log);
    });
  });
});
