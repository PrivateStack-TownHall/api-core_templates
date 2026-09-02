import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      post: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      postCategory: { count: jest.fn().mockResolvedValue(0) },
      postComment: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      postLike: { count: jest.fn().mockResolvedValue(0) },
      user: { count: jest.fn().mockResolvedValue(0) },
      notification: { count: jest.fn().mockResolvedValue(0) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('assembles the full stats payload', async () => {
    prisma.post.count.mockResolvedValue(80);
    prisma.postCategory.count.mockResolvedValue(4);
    prisma.user.count.mockResolvedValueOnce(30).mockResolvedValueOnce(1);

    const result = await service.getStats();

    expect(result.application.name).toBe('Codigram');
    expect(result.posts.total).toBe(80);
    expect(result.categories.total).toBe(4);
    expect(result.users).toEqual({ total: 30, admins: 1, members: 29 });
  });
});
