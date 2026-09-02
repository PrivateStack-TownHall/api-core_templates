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

  it('filters findAll by appType MPLOYEE', async () => {
    prisma.auditLog.findMany.mockResolvedValue([]);
    await service.findAll();
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { appType: 'MPLOYEE' } }),
    );
  });

  it('throws NotFoundException when log not found', async () => {
    prisma.auditLog.findFirst.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('tags created logs with appType MPLOYEE', async () => {
    prisma.auditLog.create.mockResolvedValue({ id: 'log-1' });
    await service.create({ userId: 'user-1', action: 'LOGIN', entity: 'User' });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ appType: 'MPLOYEE' }),
    });
  });
});
