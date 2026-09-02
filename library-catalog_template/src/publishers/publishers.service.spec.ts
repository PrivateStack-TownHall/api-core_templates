import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublishersService', () => {
  let service: PublishersService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      publisher: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      book: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a publisher', async () => {
    prisma.publisher.create.mockResolvedValue({ id: 'pub-1', name: 'Bloomsbury' });
    const result = await service.create({ name: 'Bloomsbury' });
    expect(result.message).toBe('Publisher created successfully');
  });

  it('throws NotFoundException when publisher does not exist', async () => {
    prisma.publisher.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when publisher still has books', async () => {
    prisma.publisher.findUnique.mockResolvedValue({ id: 'pub-1' });
    prisma.book.count.mockResolvedValue(3);
    await expect(service.remove('pub-1')).rejects.toThrow(ConflictException);
  });
});
