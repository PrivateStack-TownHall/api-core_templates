import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      book: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
      bookAuthor: { deleteMany: jest.fn() },
      bookGenre: { deleteMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('creates a book with nested authors and genres', async () => {
      prisma.book.create.mockResolvedValue({ id: 'book-1', title: 'A Book' });

      const result = await service.create({
        title: 'A Book',
        isbn: '123',
        publisherId: 'pub-1',
        authorIds: ['author-1'],
        genreIds: ['genre-1'],
      });

      expect(prisma.book.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authors: { create: [{ authorId: 'author-1' }] },
            genres: { create: [{ genreId: 'genre-1' }] },
          }),
        }),
      );
      expect(result.message).toBe('Book created successfully');
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when book does not exist', async () => {
      prisma.book.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });

    it('computes averageRating from reviews', async () => {
      prisma.book.findUnique.mockResolvedValue({
        id: 'book-1',
        reviews: [{ rating: 4 }, { rating: 5 }],
      });

      const result = await service.findOne('book-1');

      expect(result.data.averageRating).toBe(4.5);
    });

    it('returns null averageRating when there are no reviews', async () => {
      prisma.book.findUnique.mockResolvedValue({ id: 'book-1', reviews: [] });
      const result = await service.findOne('book-1');
      expect(result.data.averageRating).toBeNull();
    });
  });

  describe('update', () => {
    it('replaces author/genre junctions when authorIds/genreIds are provided', async () => {
      prisma.book.findUnique.mockResolvedValue({ id: 'book-1', reviews: [] });
      prisma.book.update.mockResolvedValue({ id: 'book-1' });

      await service.update('book-1', { authorIds: ['author-2'], genreIds: ['genre-2'] });

      expect(prisma.bookAuthor.deleteMany).toHaveBeenCalledWith({ where: { bookId: 'book-1' } });
      expect(prisma.bookGenre.deleteMany).toHaveBeenCalledWith({ where: { bookId: 'book-1' } });
    });
  });
});
