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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RegionsService } from './regions.service';
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

class RegionDto {
  @ApiProperty({ example: 'Southeast Asia' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class UpdateRegionDto {
  @ApiProperty({ example: 'Southeast Asia', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

@ApiTags('Regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Regions' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.regionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Region Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Region not found')
  findOne(@Param('id') id: string) {
    return this.regionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Region', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Region created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create region')
  create(@Body() dto: RegionDto) {
    return this.regionsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Region', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Region updated successfully', data: {} })
  @SwaggerNotFound('Region not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update region')
  update(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.regionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Region', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Region deleted successfully' })
  @SwaggerNotFound('Region not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete region')
  remove(@Param('id') id: string) {
    return this.regionsService.remove(id);
  }
}
