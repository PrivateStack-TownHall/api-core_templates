import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ThreadLikesService } from './thread-likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Thread Likes')
@Controller('threads')
export class ThreadLikesController {
  constructor(private readonly threadLikesService: ThreadLikesService) {}

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle Like on Thread' })
  @SwaggerSuccess({ message: 'Thread liked', data: { liked: true } })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Thread not found')
  toggle(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.threadLikesService.toggle(id, req.user.id);
  }
}
