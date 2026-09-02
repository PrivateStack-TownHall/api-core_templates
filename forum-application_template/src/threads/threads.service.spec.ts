import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ThreadsService } from './threads.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ThreadsService', () => {
  let service: ThreadsService;
  let prisma: {
    thread: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      thread: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a thread with a slugified title', async () => {
      prisma.thread.create.mockResolvedValue({
        id: 'thread-1',
        title: 'Hello World',
        slug: 'hello-world-abc123',
      });

      const result = await service.create('user-1', {
        title: 'Hello World',
        body: 'This is the body',
      });

      expect(prisma.thread.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            title: 'Hello World',
            slug: expect.stringMatching(/^hello-world-/),
          }),
        }),
      );
      expect(result.message).toBe('Thread created successfully');
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when thread does not exist', async () => {
      prisma.thread.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-slug')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the thread when found', async () => {
      prisma.thread.findUnique.mockResolvedValue({
        id: 'thread-1',
        slug: 'hello-world',
      });

      const result = await service.findOne('hello-world');

      expect(result.data.id).toBe('thread-1');
    });
  });

  describe('update', () => {
    it('throws ForbiddenException when non-owner non-admin tries to update', async () => {
      prisma.thread.findUnique.mockResolvedValue({
        id: 'thread-1',
        userId: 'owner-1',
      });

      await expect(
        service.update('thread-1', 'other-user', 'MEMBER' as any, {
          title: 'New title',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows the owner to update their own thread', async () => {
      prisma.thread.findUnique.mockResolvedValue({
        id: 'thread-1',
        userId: 'owner-1',
      });
      prisma.thread.update.mockResolvedValue({
        id: 'thread-1',
        title: 'New title',
      });

      const result = await service.update(
        'thread-1',
        'owner-1',
        'MEMBER' as any,
        {
          title: 'New title',
        },
      );

      expect(result.message).toBe('Thread updated successfully');
    });

    it('allows an admin to update any thread', async () => {
      prisma.thread.findUnique.mockResolvedValue({
        id: 'thread-1',
        userId: 'owner-1',
      });
      prisma.thread.update.mockResolvedValue({
        id: 'thread-1',
        title: 'Edited by admin',
      });

      const result = await service.update(
        'thread-1',
        'admin-1',
        'ADMIN' as any,
        {
          title: 'Edited by admin',
        },
      );

      expect(result.message).toBe('Thread updated successfully');
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when thread does not exist', async () => {
      prisma.thread.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('missing', 'user-1', 'MEMBER' as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when a non-owner tries to delete', async () => {
      prisma.thread.findUnique.mockResolvedValue({
        id: 'thread-1',
        userId: 'owner-1',
      });

      await expect(
        service.remove('thread-1', 'other-user', 'MEMBER' as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
