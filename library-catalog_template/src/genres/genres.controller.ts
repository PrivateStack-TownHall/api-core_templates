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

import { GenresService } from './genres.service';
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

class GenreDto {
  @ApiProperty({ example: 'Fantasy' }) @IsString() @IsNotEmpty() name!: string;
}
class UpdateGenreDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Genres' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Genre Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Genre not found')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Genre', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Genre created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create genre')
  create(@Body() dto: GenreDto) {
    return this.genresService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Genre', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Genre updated successfully', data: {} })
  @SwaggerNotFound('Genre not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update genre')
  update(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Genre', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Genre deleted successfully' })
  @SwaggerNotFound('Genre not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete genre')
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
