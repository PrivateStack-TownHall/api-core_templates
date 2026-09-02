import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('returns the user when found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@example.com' });
      const result = await service.findByEmail('a@example.com');
      expect(result?.id).toBe('user-1');
    });

    it('returns null when not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findByEmail('missing@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('queries by id', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      await service.findById('user-1');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-1' } });
    });
  });

  describe('createMember', () => {
    it('always creates with role MEMBER regardless of caller intent', async () => {
      prisma.user.create.mockResolvedValue({ id: 'user-1', role: 'MEMBER' });

      await service.createMember({ fullName: 'Budi', email: 'budi@example.com', password: 'hashed' });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ role: 'MEMBER' }),
      });
    });
  });

  describe('findAll', () => {
    it('returns all users ordered by createdAt desc', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'user-1' }, { id: 'user-2' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(prisma.user.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    });
  });
});
