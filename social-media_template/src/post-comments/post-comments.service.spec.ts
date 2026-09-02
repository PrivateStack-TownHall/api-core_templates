import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostCommentsService', () => {
  let service: PostCommentsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      post: { findUnique: jest.fn() },
      postComment: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      notification: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostCommentsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PostCommentsService>(PostCommentsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('throws NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);
      await expect(service.create('missing', 'user-1', { message: 'Hi' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('notifies the post owner when someone else comments', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1', userId: 'owner-1' });
      prisma.postComment.create.mockResolvedValue({ id: 'comment-1' });

      await service.create('post-1', 'commenter-1', { message: 'Nice!' });

      expect(prisma.notification.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('throws ForbiddenException for non-owner non-admin', async () => {
      prisma.postComment.findUnique.mockResolvedValue({ id: 'comment-1', userId: 'owner-1' });
      await expect(
        service.update('comment-1', 'other-user', 'MEMBER' as any, { message: 'Edited' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when comment does not exist', async () => {
      prisma.postComment.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing', 'user-1', 'MEMBER' as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
