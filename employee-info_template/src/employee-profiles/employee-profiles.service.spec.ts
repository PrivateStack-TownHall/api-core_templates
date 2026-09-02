import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { EmployeeProfilesService } from './employee-profiles.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EmployeeProfilesService', () => {
  let service: EmployeeProfilesService;
  let prisma: {
    user: { findUnique: jest.Mock };
    employeeProfile: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn() },
      employeeProfile: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeProfilesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EmployeeProfilesService>(EmployeeProfilesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.create({ userId: 'missing-user' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when user already has a profile', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.employeeProfile.findUnique.mockResolvedValue({
        id: 'existing-profile',
      });

      await expect(service.create({ userId: 'user-1' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates a profile when user exists and has none yet', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.employeeProfile.findUnique.mockResolvedValue(null);
      prisma.employeeProfile.create.mockResolvedValue({
        id: 'profile-1',
        userId: 'user-1',
      });

      const result = await service.create({ userId: 'user-1' });

      expect(result.message).toBe('Employee profile created successfully');
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when profile does not exist', async () => {
      prisma.employeeProfile.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
