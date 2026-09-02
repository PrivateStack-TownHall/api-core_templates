import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ThreadStarsService } from './thread-stars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Thread Stars')
@Controller('threads')
export class ThreadStarsController {
  constructor(private readonly threadStarsService: ThreadStarsService) {}

  @Post(':id/star')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle Star on Thread' })
  @SwaggerSuccess({ message: 'Thread starred', data: { starred: true } })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Thread not found')
  toggle(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.threadStarsService.toggle(id, req.user.id);
  }

  @Get('me/starred')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get My Starred Threads' })
  @SwaggerSuccess({ data: [] })
  @SwaggerUnauthorized()
  myStarred(@Req() req: AuthRequest) {
    return this.threadStarsService.myStarred(req.user.id);
  }
}
