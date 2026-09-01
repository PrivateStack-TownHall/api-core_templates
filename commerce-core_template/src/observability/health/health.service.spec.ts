import { Test, TestingModule } from '@nestjs/testing';

import { HealthService } from './health.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('reports status UP and database CONNECTED when the query succeeds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

    const result = await service.check();

    expect(result.status).toBe('UP');
    expect(result.database).toBe('CONNECTED');
    expect(result.application).toBe('Kings Brew');
    expect(typeof result.uptime).toBe('number');
  });

  it('reports status DOWN and database DISCONNECTED when the query fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

    const result = await service.check();

    expect(result.status).toBe('DOWN');
    expect(result.database).toBe('DISCONNECTED');
  });
});
