import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ThreadStarsService } from './thread-stars.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ThreadStarsService', () => {
  let service: ThreadStarsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      thread: { findUnique: jest.fn() },
      threadStar: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadStarsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ThreadStarsService>(ThreadStarsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('toggle', () => {
    it('throws NotFoundException when thread does not exist', async () => {
      prisma.thread.findUnique.mockResolvedValue(null);
      await expect(service.toggle('missing', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('stars the thread when not starred yet', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1' });
      prisma.threadStar.findUnique.mockResolvedValue(null);

      const result = await service.toggle('thread-1', 'user-1');

      expect(prisma.threadStar.create).toHaveBeenCalled();
      expect(result.data.starred).toBe(true);
    });

    it('unstars the thread when already starred', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1' });
      prisma.threadStar.findUnique.mockResolvedValue({ id: 'star-1' });

      const result = await service.toggle('thread-1', 'user-1');

      expect(prisma.threadStar.delete).toHaveBeenCalled();
      expect(result.data.starred).toBe(false);
    });
  });

  describe('myStarred', () => {
    it('returns threads from the starred records', async () => {
      prisma.threadStar.findMany.mockResolvedValue([
        { thread: { id: 'thread-1' } },
        { thread: { id: 'thread-2' } },
      ]);

      const result = await service.myStarred('user-1');

      expect(result.data).toHaveLength(2);
    });
  });
});
