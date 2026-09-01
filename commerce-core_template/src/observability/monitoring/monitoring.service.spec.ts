import { Test, TestingModule } from '@nestjs/testing';

import { MonitoringService } from './monitoring.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let prisma: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    prisma = { $queryRaw: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('reports database status CONNECTED with node/memory info when the query succeeds', async () => {
    prisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

    const result = await service.getMonitoring();

    expect(result.application).toBe('Kings Brew');
    expect(result.database.status).toBe('CONNECTED');
    expect(typeof result.database.latency).toBe('number');
    expect(result.node).toBeDefined();
    expect(result.memory).toBeDefined();
    expect(result.response.generatedAt).toBeDefined();
  });

  it('reports database status DISCONNECTED when the query fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

    const result = await service.getMonitoring();

    expect(result.database.status).toBe('DISCONNECTED');
  });
});
