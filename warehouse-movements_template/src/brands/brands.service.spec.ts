import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BrandsService', () => {
  let service: BrandsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      brand: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('rejects duplicate brand name', async () => {
    prisma.brand.findUnique.mockResolvedValue({ id: 'existing' });
    await expect(service.create({ name: 'Logitech' })).rejects.toThrow(ConflictException);
  });

  it('creates the brand when name is unique', async () => {
    prisma.brand.findUnique.mockResolvedValue(null);
    prisma.brand.create.mockResolvedValue({ id: 'brand-1' });
    const result = await service.create({ name: 'Logitech' });
    expect(result.message).toBe('Brand created successfully');
  });

  it('throws NotFoundException when brand does not exist', async () => {
    prisma.brand.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });
});
