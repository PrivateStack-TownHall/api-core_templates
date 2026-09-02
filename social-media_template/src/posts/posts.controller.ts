import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
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

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Posts',
    description: 'Public - filter by ?categoryId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query() query: QueryPostDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Post Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Post not found')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Post' })
  @ApiBody({ type: CreatePostDto })
  @SwaggerCreated({ message: 'Post created successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  create(@Req() req: AuthRequest, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Post', description: 'Owner or admin only' })
  @ApiBody({ type: UpdatePostDto })
  @SwaggerSuccess({ message: 'Post updated successfully', data: {} })
  @SwaggerNotFound('Post not found')
  @SwaggerForbidden('You can only update your own post')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user.id, req.user.role as any, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Post', description: 'Owner or admin only' })
  @SwaggerSuccess({ message: 'Post deleted successfully' })
  @SwaggerNotFound('Post not found')
  @SwaggerForbidden('You can only delete your own post')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.postsService.remove(id, req.user.id, req.user.role as any);
  }
}
