import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CountriesService', () => {
  let service: CountriesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      region: { findUnique: jest.fn() },
      country: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      location: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when region does not exist', async () => {
      prisma.region.findUnique.mockResolvedValue(null);
      await expect(service.create({ regionId: 'missing', name: 'Indonesia' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('creates a country when region exists', async () => {
      prisma.region.findUnique.mockResolvedValue({ id: 'region-1' });
      prisma.country.create.mockResolvedValue({ id: 'country-1' });
      const result = await service.create({ regionId: 'region-1', name: 'Indonesia' });
      expect(result.message).toBe('Country created successfully');
    });
  });

  describe('remove', () => {
    it('throws ConflictException when country still has locations', async () => {
      prisma.country.findUnique.mockResolvedValue({ id: 'country-1' });
      prisma.location.count.mockResolvedValue(1);
      await expect(service.remove('country-1')).rejects.toThrow(ConflictException);
    });
  });
});
