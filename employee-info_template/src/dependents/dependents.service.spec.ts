import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DependentsService } from './dependents.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DependentsService', () => {
  let service: DependentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      employeeProfile: { findUnique: jest.fn() },
      dependent: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DependentsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<DependentsService>(DependentsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when employee profile does not exist', async () => {
      prisma.employeeProfile.findUnique.mockResolvedValue(null);
      await expect(
        service.create('user-1', false, { employeeId: 'missing', firstName: 'Rina', lastName: 'S' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when adding to someone else\'s profile without admin', async () => {
      prisma.employeeProfile.findUnique.mockResolvedValue({ id: 'profile-1', userId: 'owner-1' });
      await expect(
        service.create('other-user', false, { employeeId: 'profile-1', firstName: 'Rina', lastName: 'S' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows admin to add dependent to any profile', async () => {
      prisma.employeeProfile.findUnique.mockResolvedValue({ id: 'profile-1', userId: 'owner-1' });
      prisma.dependent.create.mockResolvedValue({ id: 'dep-1' });

      const result = await service.create('admin-1', true, {
        employeeId: 'profile-1',
        firstName: 'Rina',
        lastName: 'S',
      });

      expect(result.message).toBe('Dependent added successfully');
    });

    it('allows the profile owner to add their own dependent', async () => {
      prisma.employeeProfile.findUnique.mockResolvedValue({ id: 'profile-1', userId: 'owner-1' });
      prisma.dependent.create.mockResolvedValue({ id: 'dep-1' });

      const result = await service.create('owner-1', false, {
        employeeId: 'profile-1',
        firstName: 'Rina',
        lastName: 'S',
      });

      expect(result.message).toBe('Dependent added successfully');
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when dependent does not exist', async () => {
      prisma.dependent.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing', 'user-1', false)).rejects.toThrow(NotFoundException);
    });
  });
});
