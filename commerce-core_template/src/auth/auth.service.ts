import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existingUser = await this.usersService.findByEmail(dto.email);

      if (existingUser) {
        throw new BadRequestException({
          message: 'Register failed',
          error: 'Email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.usersService.create({
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
      });

      await this.auditLogsService.create({
        userId: user.id,
        action: 'REGISTER',
        entity: 'User',
        entityId: user.id.toString(),
        newData: {
          email: user.email,
          fullName: user.fullName,
        },
      });
      return {
        message: 'Register success',
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Register failed',
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);

      if (!user) {
        throw new UnauthorizedException({
          message: 'Login failed',
          error: 'Invalid credentials',
        });
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException({
          message: 'Login failed',
          error: 'Invalid credentials',
        });
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      await this.auditLogsService.create({
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id.toString(),
      });

      return {
        message: 'Login success',
        accessToken,
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}
