import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PostCommentsService } from './post-comments.service';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Post Comments')
@Controller()
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'Get Comments of a Post' })
  @SwaggerSuccess({ data: [] })
  findByPost(@Param('postId') postId: string) {
    return this.postCommentsService.findByPost(postId);
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Comment to Post' })
  @ApiBody({ type: CreatePostCommentDto })
  @SwaggerCreated({ message: 'Comment added successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerNotFound('Post not found')
  create(
    @Param('postId') postId: string,
    @Req() req: AuthRequest,
    @Body() dto: CreatePostCommentDto,
  ) {
    return this.postCommentsService.create(postId, req.user.id, dto);
  }

  @Patch('post-comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Comment',
    description: 'Owner or admin only',
  })
  @ApiBody({ type: UpdatePostCommentDto })
  @SwaggerSuccess({ message: 'Comment updated successfully', data: {} })
  @SwaggerNotFound('Comment not found')
  @SwaggerForbidden('You can only update your own comment')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdatePostCommentDto,
  ) {
    return this.postCommentsService.update(
      id,
      req.user.id,
      req.user.role as any,
      dto,
    );
  }

  @Delete('post-comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Comment',
    description: 'Owner or admin only',
  })
  @SwaggerSuccess({ message: 'Comment deleted successfully' })
  @SwaggerNotFound('Comment not found')
  @SwaggerForbidden('You can only delete your own comment')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.postCommentsService.remove(
      id,
      req.user.id,
      req.user.role as any,
    );
  }
}
