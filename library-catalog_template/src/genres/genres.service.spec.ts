import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GenresService } from './genres.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GenresService', () => {
  let service: GenresService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      genre: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      bookGenre: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GenresService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => jest.clearAllMocks());

  it('creates a genre', async () => {
    prisma.genre.create.mockResolvedValue({ id: 'genre-1', name: 'Fantasy' });
    const result = await service.create({ name: 'Fantasy' });
    expect(result.message).toBe('Genre created successfully');
  });

  it('throws NotFoundException when genre does not exist', async () => {
    prisma.genre.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('throws ConflictException when genre is still used by books', async () => {
    prisma.genre.findUnique.mockResolvedValue({ id: 'genre-1' });
    prisma.bookGenre.count.mockResolvedValue(2);
    await expect(service.remove('genre-1')).rejects.toThrow(ConflictException);
  });
});
