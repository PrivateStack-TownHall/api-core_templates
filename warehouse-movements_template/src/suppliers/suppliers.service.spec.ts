import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SuppliersService', () => {
  let service: SuppliersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      supplier: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a supplier', async () => {
    prisma.supplier.create.mockResolvedValue({ id: 'sup-1', name: 'PT Sumber Elektronik' });
    const result = await service.create({ name: 'PT Sumber Elektronik' });
    expect(result.message).toBe('Supplier created successfully');
  });

  it('throws NotFoundException when supplier does not exist', async () => {
    prisma.supplier.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('soft-deletes (deactivates) instead of hard delete', async () => {
    prisma.supplier.findUnique.mockResolvedValue({ id: 'sup-1' });
    prisma.supplier.update.mockResolvedValue({ id: 'sup-1', isActive: false });

    const result = await service.remove('sup-1');

    expect(prisma.supplier.update).toHaveBeenCalledWith({
      where: { id: 'sup-1' },
      data: { isActive: false },
    });
    expect(result.message).toBe('Supplier deactivated successfully');
  });
});
