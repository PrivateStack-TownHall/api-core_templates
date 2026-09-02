import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ThreadLikesService } from './thread-likes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ThreadLikesService', () => {
  let service: ThreadLikesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      thread: { findUnique: jest.fn() },
      threadLike: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
      notification: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadLikesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ThreadLikesService>(ThreadLikesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('toggle', () => {
    it('throws NotFoundException when thread does not exist', async () => {
      prisma.thread.findUnique.mockResolvedValue(null);
      await expect(service.toggle('missing', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('likes the thread when not liked yet', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1', userId: 'owner-1' });
      prisma.threadLike.findUnique.mockResolvedValue(null);

      const result = await service.toggle('thread-1', 'user-1');

      expect(prisma.threadLike.create).toHaveBeenCalled();
      expect(result.data.liked).toBe(true);
    });

    it('unlikes the thread when already liked', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1', userId: 'owner-1' });
      prisma.threadLike.findUnique.mockResolvedValue({ id: 'like-1' });

      const result = await service.toggle('thread-1', 'user-1');

      expect(prisma.threadLike.delete).toHaveBeenCalled();
      expect(result.data.liked).toBe(false);
    });

    it('does not notify when liking own thread', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1', userId: 'owner-1' });
      prisma.threadLike.findUnique.mockResolvedValue(null);

      await service.toggle('thread-1', 'owner-1');

      expect(prisma.notification.create).not.toHaveBeenCalled();
    });
  });
});
