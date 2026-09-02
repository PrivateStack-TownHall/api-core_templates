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

import { CountriesService } from './countries.service';
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

class CountryDto {
  @ApiProperty() @IsUUID() regionId!: string;
  @ApiProperty({ example: 'Indonesia' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class UpdateCountryDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() regionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Countries',
    description: 'Filter by ?regionId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query('regionId') regionId?: string) {
    return this.countriesService.findAll(regionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Country Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Country not found')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Country', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Country created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create country')
  create(@Body() dto: CountryDto) {
    return this.countriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Country', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Country updated successfully', data: {} })
  @SwaggerNotFound('Country not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update country')
  update(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    return this.countriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Country', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Country deleted successfully' })
  @SwaggerNotFound('Country not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete country')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
