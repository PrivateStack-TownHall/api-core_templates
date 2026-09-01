import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock; create: jest.Mock };
  let jwtService: { signAsync: jest.Mock };
  let auditLogsService: { create: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn(), create: jest.fn() };
    jwtService = { signAsync: jest.fn() };
    auditLogsService = { create: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: AuditLogsService, useValue: auditLogsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('throws BadRequestException when the email is already registered', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 1, email: 'a@a.com' });

      await expect(
        service.register({ fullName: 'A', email: 'a@a.com', password: '123' } as any),
      ).rejects.toThrow(BadRequestException);
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('hashes the password, creates the user, and returns { message, data } without the password', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      usersService.create.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        fullName: 'A',
        role: 'CUSTOMER',
      });

      const result = await service.register({
        fullName: 'A',
        email: 'a@a.com',
        password: 'plain',
      } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed-password' }),
      );
      expect(result).toEqual({
        message: 'Register success',
        data: { id: 1, email: 'a@a.com', fullName: 'A', role: 'CUSTOMER' },
      });
      expect((result.data as any).password).toBeUndefined();
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'REGISTER' }),
      );
    });

    it('wraps unexpected errors in InternalServerErrorException', async () => {
      usersService.findByEmail.mockRejectedValue(new Error('db down'));

      await expect(
        service.register({ fullName: 'A', email: 'a@a.com', password: '123' } as any),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when the email is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x@x.com', password: '123' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'a@a.com', password: 'wrong' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('signs a JWT and returns { message, accessToken, data } on valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        fullName: 'A',
        role: 'CUSTOMER',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('signed-jwt-token');

      const result = await service.login({
        email: 'a@a.com',
        password: 'plain',
      } as any);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ sub: 1, email: 'a@a.com', role: 'CUSTOMER' }),
      );
      expect(result).toEqual({
        message: 'Login success',
        accessToken: 'signed-jwt-token',
        data: { id: 1, email: 'a@a.com', fullName: 'A', role: 'CUSTOMER' },
      });
      expect(auditLogsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN' }),
      );
    });
  });
});
