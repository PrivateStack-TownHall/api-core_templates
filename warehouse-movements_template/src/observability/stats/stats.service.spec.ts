import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      product: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      productCategory: { count: jest.fn().mockResolvedValue(0) },
      brand: { count: jest.fn().mockResolvedValue(0) },
      warehouse: { count: jest.fn().mockResolvedValue(0) },
      stock: { count: jest.fn().mockResolvedValue(0), aggregate: jest.fn().mockResolvedValue({ _sum: { quantity: 0 } }) },
      supplier: { count: jest.fn().mockResolvedValue(0) },
      purchase: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      transfer: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('assembles the full stats payload', async () => {
    prisma.product.count.mockResolvedValueOnce(120).mockResolvedValueOnce(110); // total, then active
    prisma.stock.aggregate.mockResolvedValue({ _sum: { quantity: 15000 } });

    const result = await service.getStats();

    expect(result.application.name).toBe('WareTrack');
    expect(result.products).toEqual({ total: 120, active: 110, inactive: 10 });
    expect(result.stocks.totalQuantity).toBe(15000);
  });

  it('falls back to 0 for stock quantity when there is no data yet', async () => {
    const result = await service.getStats();
    expect(result.stocks.totalQuantity).toBe(0);
  });
});
