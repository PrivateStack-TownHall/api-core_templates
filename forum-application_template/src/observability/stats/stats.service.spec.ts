import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StatsService', () => {
  let service: StatsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      thread: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      threadComment: { count: jest.fn().mockResolvedValue(0), findFirst: jest.fn().mockResolvedValue(null) },
      threadLike: { count: jest.fn().mockResolvedValue(0) },
      threadStar: { count: jest.fn().mockResolvedValue(0) },
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
    prisma.thread.count.mockResolvedValue(10);
    prisma.threadComment.count.mockResolvedValue(25);
    prisma.threadLike.count.mockResolvedValue(50);
    prisma.threadStar.count.mockResolvedValue(15);
    prisma.user.count.mockResolvedValueOnce(20).mockResolvedValueOnce(2); // total, then admins
    prisma.notification.count.mockResolvedValueOnce(30).mockResolvedValueOnce(5); // total, then unread

    const result = await service.getStats();

    expect(result.application.name).toBe('Pineapple Stack');
    expect(result.threads.total).toBe(10);
    expect(result.comments.total).toBe(25);
    expect(result.likes.total).toBe(50);
    expect(result.stars.total).toBe(15);
    expect(result.users).toEqual({ total: 20, admins: 2, members: 18 });
    expect(result.notifications).toEqual({ total: 30, unread: 5 });
  });

  it('returns null latest dates when there is no data yet', async () => {
    const result = await service.getStats();
    expect(result.latest.thread).toBeNull();
    expect(result.latest.comment).toBeNull();
  });
});
