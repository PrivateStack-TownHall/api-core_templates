import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WarehouseLocationsService } from './warehouse-locations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WarehouseLocationsService', () => {
  let service: WarehouseLocationsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      warehouse: { findUnique: jest.fn() },
      warehouseLocation: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseLocationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<WarehouseLocationsService>(WarehouseLocationsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when warehouse does not exist', async () => {
      prisma.warehouse.findUnique.mockResolvedValue(null);
      await expect(
        service.create({ warehouseId: 'missing', code: 'A-01', name: 'Rack A', capacity: 100 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejects duplicate location code', async () => {
      prisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
      prisma.warehouseLocation.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.create({ warehouseId: 'wh-1', code: 'A-01', name: 'Rack A', capacity: 100 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when location does not exist', async () => {
      prisma.warehouseLocation.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
