import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ThreadCommentsService } from './thread-comments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ThreadCommentsService', () => {
  let service: ThreadCommentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      thread: { findUnique: jest.fn() },
      threadComment: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      notification: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadCommentsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ThreadCommentsService>(ThreadCommentsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when thread does not exist', async () => {
      prisma.thread.findUnique.mockResolvedValue(null);
      await expect(service.create('missing-thread', 'user-1', { body: 'Hi' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('creates a comment and notifies the thread owner (not self)', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1', userId: 'owner-1' });
      prisma.threadComment.create.mockResolvedValue({ id: 'comment-1' });

      const result = await service.create('thread-1', 'commenter-1', { body: 'Nice!' });

      expect(prisma.notification.create).toHaveBeenCalled();
      expect(result.message).toBe('Comment added successfully');
    });

    it('does not notify when commenting on own thread', async () => {
      prisma.thread.findUnique.mockResolvedValue({ id: 'thread-1', userId: 'owner-1' });
      prisma.threadComment.create.mockResolvedValue({ id: 'comment-1' });

      await service.create('thread-1', 'owner-1', { body: 'My own comment' });

      expect(prisma.notification.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('throws ForbiddenException for non-owner non-admin', async () => {
      prisma.threadComment.findUnique.mockResolvedValue({ id: 'comment-1', userId: 'owner-1' });
      await expect(
        service.update('comment-1', 'other-user', 'MEMBER' as any, { body: 'Edited' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when comment does not exist', async () => {
      prisma.threadComment.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing', 'user-1', 'MEMBER' as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
