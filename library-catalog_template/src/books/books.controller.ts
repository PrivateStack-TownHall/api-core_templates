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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Books',
    description: 'Public - filter by ?search= & ?genreId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query() query: QueryBookDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Book Detail',
    description: 'Includes reviews and average rating',
  })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Book not found')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Book', description: 'Admin only' })
  @ApiBody({ type: CreateBookDto })
  @SwaggerCreated({ message: 'Book created successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create book')
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Book', description: 'Admin only' })
  @ApiBody({ type: UpdateBookDto })
  @SwaggerSuccess({ message: 'Book updated successfully', data: {} })
  @SwaggerNotFound('Book not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update book')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Book', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Book deleted successfully' })
  @SwaggerNotFound('Book not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete book')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
