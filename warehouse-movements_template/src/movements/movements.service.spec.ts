import { Test, TestingModule } from '@nestjs/testing';
import { MovementsService } from './movements.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MovementsService', () => {
  let service: MovementsService;
  let prisma: { movement: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = { movement: { findMany: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns all movements when no stockId filter given', async () => {
    prisma.movement.findMany.mockResolvedValue([{ id: 'move-1' }]);
    const result = await service.findAll();
    expect(result.data).toHaveLength(1);
    expect(prisma.movement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });

  it('filters by stockId when provided', async () => {
    prisma.movement.findMany.mockResolvedValue([]);
    await service.findAll('stock-1');
    expect(prisma.movement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { stockId: 'stock-1' } }),
    );
  });
});
