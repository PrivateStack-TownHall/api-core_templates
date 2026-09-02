import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register User',
    description: 'Create a new member account',
  })
  @ApiBody({ type: RegisterDto })
  @SwaggerCreated({
    message: 'Register success',
    data: {
      id: 'uuid',
      email: 'budi@pineapplestack.com',
      fullName: 'Budi Santoso',
      role: 'MEMBER',
    },
  })
  @SwaggerBadRequest('Email already exists')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiBody({ type: LoginDto })
  @SwaggerSuccess({
    message: 'Login success',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx.xxx',
    data: {
      id: 'uuid',
      email: 'budi@pineapplestack.com',
      fullName: 'Budi Santoso',
      role: 'MEMBER',
    },
  })
  @SwaggerUnauthorized()
  @SwaggerBadRequest('Invalid credentials')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current User' })
  @SwaggerSuccess({
    message: 'Current user',
    data: { id: 'uuid', email: 'budi@pineapplestack.com' },
  })
  @SwaggerUnauthorized()
  me(@Req() req: Request) {
    return { message: 'Current user', data: req.user };
  }
}
