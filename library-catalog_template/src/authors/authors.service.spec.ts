import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      author: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates an author', async () => {
    prisma.author.create.mockResolvedValue({ id: 'author-1', name: 'J.K. Rowling' });
    const result = await service.create({ name: 'J.K. Rowling' });
    expect(result.message).toBe('Author created successfully');
  });

  it('throws NotFoundException when author does not exist', async () => {
    prisma.author.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('deletes an author', async () => {
    prisma.author.findUnique.mockResolvedValue({ id: 'author-1' });
    const result = await service.remove('author-1');
    expect(prisma.author.delete).toHaveBeenCalled();
    expect(result.message).toBe('Author deleted successfully');
  });
});
