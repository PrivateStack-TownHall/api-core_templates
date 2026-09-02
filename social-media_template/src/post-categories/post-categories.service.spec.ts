import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PostCategoriesService } from './post-categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostCategoriesService', () => {
  let service: PostCategoriesService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      postCategory: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      post: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostCategoriesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PostCategoriesService>(PostCategoriesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('creates a category', async () => {
      prisma.postCategory.create.mockResolvedValue({ id: 'cat-1', name: 'Travel' });
      const result = await service.create({ name: 'Travel' });
      expect(result.message).toBe('Category created successfully');
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when category does not exist', async () => {
      prisma.postCategory.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws ConflictException when category still has posts', async () => {
      prisma.postCategory.findUnique.mockResolvedValue({ id: 'cat-1' });
      prisma.post.count.mockResolvedValue(3);
      await expect(service.remove('cat-1')).rejects.toThrow(ConflictException);
    });

    it('deletes the category when it has no posts', async () => {
      prisma.postCategory.findUnique.mockResolvedValue({ id: 'cat-1' });
      prisma.post.count.mockResolvedValue(0);
      const result = await service.remove('cat-1');
      expect(prisma.postCategory.delete).toHaveBeenCalled();
      expect(result.message).toBe('Category deleted successfully');
    });
  });
});
