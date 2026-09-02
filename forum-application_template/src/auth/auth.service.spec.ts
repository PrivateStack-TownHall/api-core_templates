import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock; createMember: jest.Mock };
  let auditLogsService: { create: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn(), createMember: jest.fn() };
    auditLogsService = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: AuditLogsService, useValue: auditLogsService },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('rejects when email already registered', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.register({
          fullName: 'Test',
          email: 'taken@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('always creates the user via createMember (never lets caller pick a role)', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.createMember.mockResolvedValue({
        id: 'user-1',
        email: 'new@example.com',
        fullName: 'New User',
        role: 'MEMBER',
      });

      const result = await service.register({
        fullName: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(usersService.createMember).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          fullName: 'New User',
        }),
      );
      expect(result.data.role).toBe('MEMBER');
      expect(auditLogsService.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('rejects when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'whatever' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects when password does not match', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        password: hashed,
      });

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns an access token on valid credentials', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        fullName: 'User',
        role: 'MEMBER',
        password: hashed,
      });

      const result = await service.login({
        email: 'user@example.com',
        password: 'correct-password',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(auditLogsService.create).toHaveBeenCalled();
    });
  });
});
