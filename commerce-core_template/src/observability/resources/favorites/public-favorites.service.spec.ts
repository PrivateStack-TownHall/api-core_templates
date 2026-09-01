import { Test, TestingModule } from '@nestjs/testing';

import { PublicFavoritesService } from './public-favorites.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PublicFavoritesService', () => {
  let service: PublicFavoritesService;
  let prisma: { favorite: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { favorite: { findMany: jest.fn(), findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicFavoritesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PublicFavoritesService>(PublicFavoritesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns every favorite wrapped in { data }, no auth scoping', async () => {
    const favorites = [{ id: 1, userId: 1 }, { id: 2, userId: 2 }];
    prisma.favorite.findMany.mockResolvedValue(favorites);

    const result = await service.findAll();

    expect(result).toEqual({ data: favorites });
  });

  it('findOne returns { data: null } when the favorite does not exist', async () => {
    prisma.favorite.findUnique.mockResolvedValue(null);

    const result = await service.findOne(999);

    expect(result).toEqual({ data: null });
  });

  it('findOne returns the favorite wrapped in { data } when it exists', async () => {
    const favorite = { id: 1, userId: 1 };
    prisma.favorite.findUnique.mockResolvedValue(favorite);

    const result = await service.findOne(1);

    expect(result).toEqual({ data: favorite });
  });
});
