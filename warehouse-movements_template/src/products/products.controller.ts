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

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  SwaggerConflict,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Products',
    description: 'Filter by ?search= & ?categoryId=',
  })
  @SwaggerSuccess({ data: [] })
  findAll(@Query() query: QueryProductDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Product Detail',
    description: 'Includes stock across warehouses',
  })
  @SwaggerSuccess({ data: {} })
  @SwaggerNotFound('Product not found')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Product', description: 'Admin only' })
  @ApiBody({ type: CreateProductDto })
  @SwaggerCreated({ message: 'Product created successfully', data: {} })
  @SwaggerConflict('SKU already exists')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create product')
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Product', description: 'Admin only' })
  @ApiBody({ type: UpdateProductDto })
  @SwaggerSuccess({ message: 'Product updated successfully', data: {} })
  @SwaggerNotFound('Product not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update product')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Product', description: 'Admin only' })
  @SwaggerSuccess({ message: 'Product deleted successfully' })
  @SwaggerNotFound('Product not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete product')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
