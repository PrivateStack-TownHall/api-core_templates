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

  describe('findByEmail', () => {
    it('returns the user when found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      const result = await service.findByEmail('a@example.com');
      expect(result?.id).toBe('user-1');
    });
  });

  describe('createMember', () => {
    it('always creates with role MEMBER', async () => {
      prisma.user.create.mockResolvedValue({ id: 'user-1', role: 'MEMBER' });
      await service.createMember({ fullName: 'Dina', email: 'dina@example.com', password: 'hashed' });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ role: 'MEMBER' }),
      });
    });
  });

  describe('findAll', () => {
    it('returns all users', async () => {
      prisma.user.findMany.mockResolvedValue([{ id: 'user-1' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });
});
