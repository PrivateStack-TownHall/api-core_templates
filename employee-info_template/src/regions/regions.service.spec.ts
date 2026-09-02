import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RegionsService', () => {
  let service: RegionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      region: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      country: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<RegionsService>(RegionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a region', async () => {
    prisma.region.create.mockResolvedValue({ id: 'region-1', name: 'Southeast Asia' });
    const result = await service.create({ name: 'Southeast Asia' });
    expect(result.message).toBe('Region created successfully');
  });

  it('throws NotFoundException when region does not exist', async () => {
    prisma.region.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when region still has countries', async () => {
    prisma.region.findUnique.mockResolvedValue({ id: 'region-1' });
    prisma.country.count.mockResolvedValue(2);
    await expect(service.remove('region-1')).rejects.toThrow(ConflictException);
  });

  it('deletes the region when it has no countries', async () => {
    prisma.region.findUnique.mockResolvedValue({ id: 'region-1' });
    prisma.country.count.mockResolvedValue(0);
    const result = await service.remove('region-1');
    expect(result.message).toBe('Region deleted successfully');
  });
});
