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

import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { QueryThreadDto } from './dto/query-thread.dto';
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

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Threads',
    description: 'Public - filter by ?search= & ?category=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query() query: QueryThreadDto) {
    return this.threadsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get Thread Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Thread not found')
  findOne(@Param('slug') slug: string) {
    return this.threadsService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Thread' })
  @ApiBody({ type: CreateThreadDto })
  @SwaggerCreated({ message: 'Thread created successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  create(@Req() req: AuthRequest, @Body() dto: CreateThreadDto) {
    return this.threadsService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Thread',
    description: 'Owner or admin only',
  })
  @ApiBody({ type: UpdateThreadDto })
  @SwaggerSuccess({ message: 'Thread updated successfully', data: {} })
  @SwaggerNotFound('Thread not found')
  @SwaggerForbidden('You can only update your own thread')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateThreadDto,
  ) {
    return this.threadsService.update(
      id,
      req.user.id,
      req.user.role as any,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Thread',
    description: 'Owner or admin only',
  })
  @SwaggerSuccess({ message: 'Thread deleted successfully' })
  @SwaggerNotFound('Thread not found')
  @SwaggerForbidden('You can only delete your own thread')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.threadsService.remove(id, req.user.id, req.user.role as any);
  }
}
