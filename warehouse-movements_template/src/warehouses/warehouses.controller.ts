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
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import { WarehousesService } from './warehouses.service';
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

class WarehouseDto {
  @ApiProperty({ example: 'WH-JKT-01' })
  @IsString()
  @IsNotEmpty()
  code!: string;
  @ApiProperty({ example: 'Jakarta Main Warehouse' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiPropertyOptional({ example: 'Jl. Industri No. 12' })
  @IsOptional()
  @IsString()
  address?: string;
  @ApiProperty({ example: 5000 }) @IsInt() @Min(0) capacity!: number;
}
class UpdateWarehouseDto {
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) capacity?: number;
}

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Warehouses' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Warehouse Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Warehouse not found')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Warehouse', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Warehouse created successfully', data: {} })
  @SwaggerConflict('Warehouse code already exists')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create warehouse')
  create(@Body() dto: WarehouseDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Warehouse', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Warehouse updated successfully', data: {} })
  @SwaggerNotFound('Warehouse not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update warehouse')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Warehouse', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Warehouse deleted successfully' })
  @SwaggerNotFound('Warehouse not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete warehouse')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
