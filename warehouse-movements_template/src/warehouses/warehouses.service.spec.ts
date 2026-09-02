import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      warehouse: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      stock: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehousesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('rejects duplicate warehouse code', async () => {
    prisma.warehouse.findUnique.mockResolvedValue({ id: 'existing' });
    await expect(service.create({ code: 'WH-01', name: 'Main', capacity: 5000 })).rejects.toThrow(
      ConflictException,
    );
  });

  it('throws NotFoundException when warehouse does not exist', async () => {
    prisma.warehouse.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when warehouse still has stock', async () => {
    prisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
    prisma.stock.count.mockResolvedValue(2);
    await expect(service.remove('wh-1')).rejects.toThrow(ConflictException);
  });

  it('deletes the warehouse when it has no stock', async () => {
    prisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
    prisma.stock.count.mockResolvedValue(0);
    const result = await service.remove('wh-1');
    expect(result.message).toBe('Warehouse deleted successfully');
  });
});
