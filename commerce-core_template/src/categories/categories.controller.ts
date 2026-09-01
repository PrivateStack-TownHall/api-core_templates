import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

@ApiTags('Coffee Categories')
@Controller('coffee-categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Coffee Categories',
    description: 'Retrieve all coffee categories',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        appType: 'COFFEE',
        name: 'Coffee',
        description: 'Coffee category',
        createdAt: '2026-06-17T00:00:00.000Z',
        updatedAt: '2026-06-17T00:00:00.000Z',
      },
    ],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Coffee Category',
    description: 'Retrieve coffee category by id',
  })
  @SwaggerSuccess({
    data: {
      id: 1,
      appType: 'COFFEE',
      name: 'Coffee',
      description: 'Coffee category',
    },
  })
  @SwaggerNotFound('Coffee category not found')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Coffee Category',
    description: 'Create new coffee category (admin only)',
  })
  @ApiBody({
    type: CreateCategoryDto,
  })
  @SwaggerCreated({
    message: 'Coffee category created successfully',
    data: {
      id: 1,
      appType: 'COFFEE',
      name: 'Coffee',
      description: 'Coffee category',
    },
  })
  @SwaggerBadRequest('Coffee category already exists')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create coffee category')
  create(
    @Body()
    dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Coffee Category',
    description: 'Update coffee category by id (admin only)',
  })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @SwaggerSuccess({
    message: 'Coffee category updated successfully',
    data: {
      id: 1,
      appType: 'COFFEE',
      name: 'Coffee',
      description: 'Updated coffee category',
    },
  })
  @SwaggerNotFound('Coffee category not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update coffee category')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Coffee Category',
    description: 'Delete coffee category by id (admin only)',
  })
  @SwaggerSuccess({
    message: 'Coffee category deleted successfully',
  })
  @SwaggerNotFound('Coffee category not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete coffee category')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoriesService.remove(id);
  }
}
