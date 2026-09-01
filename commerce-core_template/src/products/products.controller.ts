import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Coffees')
@Controller('coffees')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Coffee',
    description: 'Create a new coffee product (admin only)',
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @SwaggerCreated({
    message: 'Coffee created successfully',
    data: {
      id: 1,
      categoryId: 1,
      appType: 'COFFEE',
      name: 'Espresso',
      description: 'Strong espresso shot',
      price: 25000,
      stock: 100,
      isActive: true,
      createdAt: '2026-06-17T00:00:00.000Z',
      updatedAt: '2026-06-17T00:00:00.000Z',
    },
  })
  @SwaggerBadRequest('Invalid coffee data')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create coffee')
  create(
    @Body()
    dto: CreateProductDto,
  ) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Coffees',
    description: 'Retrieve coffees with pagination, search and sorting',
  })
  @SwaggerSuccess({
    meta: {
      page: 1,
      limit: 10,
      total: 12,
      totalPages: 2,
    },
    data: [
      {
        id: 1,
        categoryId: 1,
        appType: 'COFFEE',
        name: 'Espresso',
        description: 'Strong espresso shot',
        price: 25000,
        stock: 100,
        isActive: true,
      },
    ],
  })
  findAll(
    @Query()
    query: QueryProductDto,
  ) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Coffee',
    description: 'Retrieve coffee detail by id',
  })
  @SwaggerSuccess({
    data: {
      id: 1,
      categoryId: 1,
      appType: 'COFFEE',
      name: 'Espresso',
      description: 'Strong espresso shot',
      price: 25000,
      stock: 100,
      isActive: true,
      category: {
        id: 1,
        name: 'Coffee',
      },
      images: [],
    },
  })
  @SwaggerNotFound('Coffee not found')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Coffee',
    description: 'Update coffee by id (admin only)',
  })
  @ApiBody({
    type: UpdateProductDto,
  })
  @SwaggerSuccess({
    message: 'Coffee updated successfully',
    data: {
      id: 1,
      categoryId: 1,
      appType: 'COFFEE',
      name: 'Updated Espresso',
      description: 'Updated description',
      price: 30000,
      stock: 90,
      isActive: true,
    },
  })
  @SwaggerNotFound('Coffee not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update coffee')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Coffee',
    description: 'Delete coffee by id (admin only)',
  })
  @SwaggerSuccess({
    message: 'Coffee deleted successfully',
  })
  @SwaggerNotFound('Coffee not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete coffee')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productsService.remove(id);
  }
}
