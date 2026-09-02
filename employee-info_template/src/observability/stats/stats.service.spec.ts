import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      employeeProfile: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      department: { count: jest.fn().mockResolvedValue(0) },
      job: { count: jest.fn().mockResolvedValue(0) },
      region: { count: jest.fn().mockResolvedValue(0) },
      country: { count: jest.fn().mockResolvedValue(0) },
      location: { count: jest.fn().mockResolvedValue(0) },
      dependent: { count: jest.fn().mockResolvedValue(0) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('assembles the full stats payload', async () => {
    prisma.employeeProfile.count.mockResolvedValue(50);
    prisma.department.count.mockResolvedValue(6);

    const result = await service.getStats();

    expect(result.application.name).toBe('M-ployee');
    expect(result.employees.total).toBe(50);
    expect(result.departments.total).toBe(6);
  });
});
