import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';

describe('JobsService', () => {
  let service: JobsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      job: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('creates a job when maxSalary >= minSalary', async () => {
      prisma.job.create.mockResolvedValue({ id: 'job-1', title: 'Software Engineer' });
      const result = await service.create({ title: 'Software Engineer', minSalary: 8000000, maxSalary: 20000000 });
      expect(result.message).toBe('Job created successfully');
    });

    it('rejects when maxSalary is less than minSalary', async () => {
      await expect(
        service.create({ title: 'Bad Job', minSalary: 20000000, maxSalary: 8000000 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when job does not exist', async () => {
      prisma.job.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
