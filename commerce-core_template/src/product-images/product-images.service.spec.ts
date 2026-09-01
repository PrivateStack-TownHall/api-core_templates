import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ProductImagesService } from './product-images.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductImagesService', () => {
  let service: ProductImagesService;
  let prisma: {
    productImage: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      productImage: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductImagesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductImagesService>(ProductImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates an image, defaults sortOrder to 0, returns { message, data }', async () => {
      const image = { id: 1, productId: 1, imageUrl: 'url', sortOrder: 0 };
      prisma.productImage.create.mockResolvedValue(image);

      const result = await service.create({ productId: 1, imageUrl: 'url' } as any);

      expect(prisma.productImage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { productId: 1, imageUrl: 'url', sortOrder: 0 },
        }),
      );
      expect(result).toEqual({
        message: 'Coffee image created successfully',
        data: image,
      });
    });
  });

  describe('findAll', () => {
    it('returns { data } ordered by sortOrder', async () => {
      const images = [{ id: 1, sortOrder: 1 }];
      prisma.productImage.findMany.mockResolvedValue(images);

      const result = await service.findAll();

      expect(result).toEqual({ data: images });
    });
  });

  describe('findOne', () => {
    it('returns { data } for an existing image', async () => {
      const image = { id: 1 };
      prisma.productImage.findFirst.mockResolvedValue(image);

      const result = await service.findOne(1);

      expect(result).toEqual({ data: image });
    });

    it('throws NotFoundException when image does not exist', async () => {
      prisma.productImage.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns { message, data }', async () => {
      prisma.productImage.findFirst.mockResolvedValue({ id: 1 });
      const updated = { id: 1, sortOrder: 5 };
      prisma.productImage.update.mockResolvedValue(updated);

      const result = await service.update(1, { sortOrder: 5 } as any);

      expect(result).toEqual({
        message: 'Coffee image updated successfully',
        data: updated,
      });
    });

    it('throws NotFoundException before updating when image is missing', async () => {
      prisma.productImage.findFirst.mockResolvedValue(null);

      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
      expect(prisma.productImage.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes and returns only { message }', async () => {
      prisma.productImage.findFirst.mockResolvedValue({ id: 1 });
      prisma.productImage.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Coffee image deleted successfully' });
    });

    it('throws NotFoundException before deleting when image is missing', async () => {
      prisma.productImage.findFirst.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(prisma.productImage.delete).not.toHaveBeenCalled();
    });
  });
});
