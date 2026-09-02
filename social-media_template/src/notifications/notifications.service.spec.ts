import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      notification: { findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns notifications for the given recipient', async () => {
    prisma.notification.findMany.mockResolvedValue([{ id: 'notif-1' }]);
    const result = await service.findMine('user-1');
    expect(result.data).toHaveLength(1);
  });

  it('throws NotFoundException when marking a notification that is not the user\'s', async () => {
    prisma.notification.findFirst.mockResolvedValue(null);
    await expect(service.markRead('notif-1', 'user-1')).rejects.toThrow(NotFoundException);
  });

  it('marks all unread notifications as read', async () => {
    await service.markAllRead('user-1');
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { recipientId: 'user-1', isRead: false },
      data: { isRead: true },
    });
  });
});
