import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LocationsService', () => {
  let service: LocationsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      country: { findUnique: jest.fn() },
      location: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      department: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when country does not exist', async () => {
      prisma.country.findUnique.mockResolvedValue(null);
      await expect(service.create({ countryId: 'missing', city: 'Jakarta' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('throws ConflictException when location still has departments', async () => {
      prisma.location.findUnique.mockResolvedValue({ id: 'loc-1' });
      prisma.department.count.mockResolvedValue(1);
      await expect(service.remove('loc-1')).rejects.toThrow(ConflictException);
    });

    it('deletes the location when it has no departments', async () => {
      prisma.location.findUnique.mockResolvedValue({ id: 'loc-1' });
      prisma.department.count.mockResolvedValue(0);
      const result = await service.remove('loc-1');
      expect(result.message).toBe('Location deleted successfully');
    });
  });
});
