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

import { BrandsService } from './brands.service';
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

class BrandDto {
  @ApiProperty({ example: 'Samsung' }) @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}
class UpdateBrandDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
}

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Brands' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Brand Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Brand not found')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Brand', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Brand created successfully', data: {} })
  @SwaggerConflict('Brand name already exists')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create brand')
  create(@Body() dto: BrandDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Brand', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Brand updated successfully', data: {} })
  @SwaggerNotFound('Brand not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update brand')
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Brand', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Brand deleted successfully' })
  @SwaggerNotFound('Brand not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete brand')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
