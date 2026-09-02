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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ProductCategoriesService } from './product-categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerConflict,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

class CategoryDto {
  @ApiProperty({ example: 'ELEC' }) @IsString() @IsNotEmpty() code!: string;
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
}
class UpdateCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
}

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Categories' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Category Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Category not found')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Category', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Category created successfully', data: {} })
  @SwaggerConflict('Category code already exists')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create category')
  create(@Body() dto: CategoryDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Category', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Category updated successfully', data: {} })
  @SwaggerNotFound('Category not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update category')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Category', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Category deleted successfully' })
  @SwaggerNotFound('Category not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete category')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
