import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PostLikesService } from './post-likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Post Likes')
@Controller('posts')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle Like on Post' })
  @SwaggerSuccess({ message: 'Post liked', data: { liked: true } })
  @SwaggerUnauthorized()
  @SwaggerNotFound('Post not found')
  toggle(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.postLikesService.toggle(id, req.user.id);
  }
}
