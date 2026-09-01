import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail looks up a user by email', async () => {
    const user = { id: 1, email: 'a@a.com' };
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.findByEmail('a@a.com');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'a@a.com' },
    });
    expect(result).toEqual(user);
  });

  it('findByEmail returns null when no user matches', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const result = await service.findByEmail('nobody@a.com');

    expect(result).toBeNull();
  });

  it('create passes the given data straight through to Prisma', async () => {
    const data = { fullName: 'A', email: 'a@a.com', password: 'hashed' };
    const created = { id: 1, ...data };
    prisma.user.create.mockResolvedValue(created);

    const result = await service.create(data);

    expect(prisma.user.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual(created);
  });

  it('findById looks up a user by id', async () => {
    const user = { id: 1, email: 'a@a.com' };
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.findById(1);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(user);
  });

  it('findAll lists users ordered by id ascending', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    prisma.user.findMany.mockResolvedValue(users);

    const result = await service.findAll();

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
    });
    expect(result).toEqual(users);
  });
});
