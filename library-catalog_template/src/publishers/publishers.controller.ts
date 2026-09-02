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

import { PublishersService } from './publishers.service';
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

class PublisherDto {
  @ApiProperty({ example: 'Bloomsbury' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiPropertyOptional({ example: 'https://bloomsbury.com' })
  @IsOptional()
  @IsString()
  website?: string;
}
class UpdatePublisherDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
}

@ApiTags('Publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Publishers' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.publishersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Publisher Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Publisher not found')
  findOne(@Param('id') id: string) {
    return this.publishersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Publisher', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Publisher created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create publisher')
  create(@Body() dto: PublisherDto) {
    return this.publishersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Publisher', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Publisher updated successfully', data: {} })
  @SwaggerNotFound('Publisher not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update publisher')
  update(@Param('id') id: string, @Body() dto: UpdatePublisherDto) {
    return this.publishersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Publisher', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Publisher deleted successfully' })
  @SwaggerNotFound('Publisher not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete publisher')
  remove(@Param('id') id: string) {
    return this.publishersService.remove(id);
  }
}
