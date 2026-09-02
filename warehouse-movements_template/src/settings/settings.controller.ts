import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { SettingsService } from './settings.service';
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

class SettingsDto {
  @ApiProperty({ example: 'WareTrack HQ' })
  @IsString()
  @IsNotEmpty()
  warehouseName!: string;
  @ApiProperty({ example: 'WH-HQ' })
  @IsString()
  @IsNotEmpty()
  warehouseCode!: string;
  @ApiProperty({ example: 'Jl. Industri No. 1' })
  @IsString()
  @IsNotEmpty()
  warehouseAddress!: string;
  @ApiProperty({ example: 10000 }) @IsInt() @Min(0) warehouseCapacity!: number;
}

class UpdateSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() warehouseAddress?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  warehouseCapacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() lowStockAlert?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() dailyReport?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  transferNotification?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoBackup?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) sessionTimeout?: number;
}

// Settings sengaja ADMIN ONLY buat baca DAN tulis (beda dari resource lain
// yang read-nya publik) - ini data konfigurasi sensitif, bukan data publik.
@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Settings', description: 'Admin only' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Settings not initialized yet')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can view settings')
  get() {
    return this.service.get();
  }

  @Post()
  @ApiOperation({
    summary: 'Initialize Settings',
    description:
      'Admin only - creates or overwrites the single settings record',
  })
  @SwaggerSuccess({ message: 'Settings created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create settings')
  create(@Body() dto: SettingsDto) {
    return this.service.create(dto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update Settings', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Settings updated successfully', data: {} })
  @SwaggerNotFound('Settings not initialized yet')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update settings')
  update(@Body() dto: UpdateSettingsDto) {
    return this.service.update(dto);
  }
}
