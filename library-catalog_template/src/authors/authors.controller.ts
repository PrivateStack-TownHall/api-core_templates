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

import { AuthorsService } from './authors.service';
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

class AuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiPropertyOptional({
    example: 'British author, best known for Harry Potter',
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
class UpdateAuthorDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bio?: string;
}

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Authors' })
  @SwaggerSuccess({ data: [] })
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Author Detail' })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Author not found')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Author', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Author created successfully', data: {} })
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create author')
  create(@Body() dto: AuthorDto) {
    return this.authorsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Author', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Author updated successfully', data: {} })
  @SwaggerNotFound('Author not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update author')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Author', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Author deleted successfully' })
  @SwaggerNotFound('Author not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete author')
  remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
