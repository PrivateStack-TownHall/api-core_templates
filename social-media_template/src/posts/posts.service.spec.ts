import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: {
    post: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      post: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a post for the given user', async () => {
      prisma.post.create.mockResolvedValue({ id: 'post-1', caption: 'Hello' });

      const result = await service.create('user-1', {
        categoryId: 'cat-1',
        caption: 'Hello',
      });

      expect(prisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'user-1' }),
        }),
      );
      expect(result.message).toBe('Post created successfully');
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('throws ForbiddenException for non-owner non-admin', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        userId: 'owner-1',
      });

      await expect(
        service.update('post-1', 'other-user', 'MEMBER' as any, {
          caption: 'Edited',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows owner to update their own post', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        userId: 'owner-1',
      });
      prisma.post.update.mockResolvedValue({ id: 'post-1', caption: 'Edited' });

      const result = await service.update(
        'post-1',
        'owner-1',
        'MEMBER' as any,
        { caption: 'Edited' },
      );
      expect(result.message).toBe('Post updated successfully');
    });
  });

  describe('remove', () => {
    it('throws ForbiddenException for non-owner', async () => {
      prisma.post.findUnique.mockResolvedValue({
        id: 'post-1',
        userId: 'owner-1',
      });

      await expect(
        service.remove('post-1', 'other-user', 'MEMBER' as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
