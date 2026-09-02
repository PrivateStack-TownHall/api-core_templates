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
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

class LocationDto {
  @ApiProperty() @IsUUID() countryId!: string;
  @ApiProperty({ example: 'Jakarta' }) @IsString() @IsNotEmpty() city!: string;
  @ApiPropertyOptional({ example: 'Jl. Sudirman No. 1' })
  @IsOptional()
  @IsString()
  streetAddress?: string;
  @ApiPropertyOptional({ example: '10220' })
  @IsOptional()
  @IsString()
  postalCode?: string;
  @ApiPropertyOptional({ example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  stateProvince?: string;
}

class UpdateLocationDto {
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() streetAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() postalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() stateProvince?: string;
}

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Locations',
    description: 'Filter by ?countryId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query('countryId') countryId?: string) {
    return this.locationsService.findAll(countryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Location Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Location not found')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Location', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Location created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create location')
  create(@Body() dto: LocationDto) {
    return this.locationsService.create(dto);
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
    return this.locationsService.update(id, dto);
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
    return this.locationsService.remove(id);
  }
}
