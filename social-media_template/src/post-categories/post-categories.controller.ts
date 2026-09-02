import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PostCategoriesService } from './post-categories.service';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Post Categories')
@Controller('post-categories')
export class PostCategoriesController {
  constructor(private readonly postCategoriesService: PostCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Post Categories' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.postCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Post Category Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Category not found')
  findOne(@Param('id') id: string) {
    return this.postCategoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Post Category', description: 'Admin only' })
  @ApiBody({ type: CreatePostCategoryDto })
  @SwaggerCreated({ message: 'Category created successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create category')
  create(@Body() dto: CreatePostCategoryDto) {
    return this.postCategoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Post Category', description: 'Admin only' })
  @ApiBody({ type: UpdatePostCategoryDto })
  @SwaggerSuccess({ message: 'Category updated successfully', data: {} })
  @SwaggerNotFound('Category not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update category')
  update(@Param('id') id: string, @Body() dto: UpdatePostCategoryDto) {
    return this.postCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Post Category', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Category deleted successfully' })
  @SwaggerNotFound('Category not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete category')
  remove(@Param('id') id: string) {
    return this.postCategoriesService.remove(id);
  }
}
