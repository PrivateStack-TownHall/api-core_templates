import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostLikesService', () => {
  let service: PostLikesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      post: { findUnique: jest.fn() },
      postLike: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
      notification: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostLikesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PostLikesService>(PostLikesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('toggle', () => {
    it('throws NotFoundException when post does not exist', async () => {
      prisma.post.findUnique.mockResolvedValue(null);
      await expect(service.toggle('missing', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('likes the post when not liked yet', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1', userId: 'owner-1' });
      prisma.postLike.findUnique.mockResolvedValue(null);

      const result = await service.toggle('post-1', 'user-1');

      expect(prisma.postLike.create).toHaveBeenCalled();
      expect(result.data.liked).toBe(true);
    });

    it('unlikes the post when already liked', async () => {
      prisma.post.findUnique.mockResolvedValue({ id: 'post-1', userId: 'owner-1' });
      prisma.postLike.findUnique.mockResolvedValue({ userId: 'user-1', postId: 'post-1' });

      const result = await service.toggle('post-1', 'user-1');

      expect(prisma.postLike.delete).toHaveBeenCalled();
      expect(result.data.liked).toBe(false);
    });
  });
});
