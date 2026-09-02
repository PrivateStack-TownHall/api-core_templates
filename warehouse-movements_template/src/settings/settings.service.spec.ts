import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let prisma: { setting: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = { setting: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('get', () => {
    it('throws NotFoundException when settings not initialized', async () => {
      prisma.setting.findFirst.mockResolvedValue(null);
      await expect(service.get()).rejects.toThrow(NotFoundException);
    });

    it('returns settings when they exist', async () => {
      prisma.setting.findFirst.mockResolvedValue({ id: 'settings-1', warehouseName: 'WareTrack HQ' });
      const result = await service.get();
      expect(result.data.warehouseName).toBe('WareTrack HQ');
    });
  });

  describe('create', () => {
    it('creates settings when none exist yet', async () => {
      prisma.setting.findFirst.mockResolvedValue(null);
      prisma.setting.create.mockResolvedValue({ id: 'settings-1' });

      const result = await service.create({
        warehouseName: 'WareTrack HQ',
        warehouseCode: 'WH-HQ',
        warehouseAddress: 'Jl. Industri No. 1',
        warehouseCapacity: 10000,
      });

      expect(prisma.setting.create).toHaveBeenCalled();
      expect(result.message).toBe('Settings created successfully');
    });

    it('updates the existing record instead of creating a second one', async () => {
      prisma.setting.findFirst.mockResolvedValue({ id: 'settings-1' });
      prisma.setting.update.mockResolvedValue({ id: 'settings-1' });

      const result = await service.create({
        warehouseName: 'WareTrack HQ v2',
        warehouseCode: 'WH-HQ',
        warehouseAddress: 'Jl. Industri No. 1',
        warehouseCapacity: 10000,
      });

      expect(prisma.setting.update).toHaveBeenCalled();
      expect(prisma.setting.create).not.toHaveBeenCalled();
      expect(result.message).toBe('Settings updated successfully');
    });
  });

  describe('update', () => {
    it('throws NotFoundException when settings not initialized', async () => {
      prisma.setting.findFirst.mockResolvedValue(null);
      await expect(service.update({ lowStockAlert: false })).rejects.toThrow(NotFoundException);
    });
  });
});
