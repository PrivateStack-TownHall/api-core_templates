import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

import { WarehouseLocationsService } from './warehouse-locations.service';
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

class LocationDto {
  @ApiProperty() @IsUUID() warehouseId!: string;
  @ApiProperty({ example: 'A-01-01' }) @IsString() @IsNotEmpty() code!: string;
  @ApiProperty({ example: 'Rack A, Row 1, Bin 1' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiProperty({ example: 100 }) @IsInt() @Min(0) capacity!: number;
}
class UpdateLocationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) capacity?: number;
}

@ApiTags('Warehouse Locations')
@Controller('warehouse-locations')
export class WarehouseLocationsController {
  constructor(private readonly service: WarehouseLocationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Locations',
    description: 'Filter by ?warehouseId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query('warehouseId') warehouseId?: string) {
    return this.service.findAll(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Location Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Location not found')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Location', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Location created successfully', data: {} })
  @SwaggerConflict('Location code already exists')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create location')
  create(@Body() dto: LocationDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Location', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Location updated successfully', data: {} })
  @SwaggerNotFound('Location not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update location')
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Location', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Location deleted successfully' })
  @SwaggerNotFound('Location not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete location')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
