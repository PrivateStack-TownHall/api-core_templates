import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      location: { findUnique: jest.fn() },
      department: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when location does not exist', async () => {
      prisma.location.findUnique.mockResolvedValue(null);
      await expect(service.create({ locationId: 'missing', name: 'Engineering' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deletes without checking employees (SetNull handles it at DB level)', async () => {
      prisma.department.findUnique.mockResolvedValue({ id: 'dept-1' });
      const result = await service.remove('dept-1');
      expect(prisma.department.delete).toHaveBeenCalled();
      expect(result.message).toBe('Department deleted successfully');
    });
  });
});
