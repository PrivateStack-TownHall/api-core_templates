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

import { ThreadCommentsService } from './thread-comments.service';
import { CreateThreadCommentDto } from './dto/create-thread-comment.dto';
import { UpdateThreadCommentDto } from './dto/update-thread-comment.dto';
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

@ApiTags('Thread Comments')
@Controller()
export class ThreadCommentsController {
  constructor(private readonly threadCommentsService: ThreadCommentsService) {}

  @Get('threads/:threadId/comments')
  @ApiOperation({ summary: 'Get Comments of a Thread' })
  @SwaggerSuccess({ data: [] })
  findByThread(@Param('threadId') threadId: string) {
    return this.threadCommentsService.findByThread(threadId);
  }

  @Post('threads/:threadId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add Comment to Thread' })
  @ApiBody({ type: CreateThreadCommentDto })
  @SwaggerCreated({ message: 'Comment added successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerNotFound('Thread not found')
  create(
    @Param('threadId') threadId: string,
    @Req() req: AuthRequest,
    @Body() dto: CreateThreadCommentDto,
  ) {
    return this.threadCommentsService.create(threadId, req.user.id, dto);
  }

  @Patch('thread-comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Comment',
    description: 'Owner or admin only',
  })
  @ApiBody({ type: UpdateThreadCommentDto })
  @SwaggerSuccess({ message: 'Comment updated successfully', data: {} })
  @SwaggerNotFound('Comment not found')
  @SwaggerForbidden('You can only update your own comment')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateThreadCommentDto,
  ) {
    return this.threadCommentsService.update(
      id,
      req.user.id,
      req.user.role as any,
      dto,
    );
  }

  @Delete('thread-comments/:id')
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
    return this.threadCommentsService.remove(
      id,
      req.user.id,
      req.user.role as any,
    );
  }
}
