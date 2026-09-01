import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

import { ProductImagesService } from './product-images.service';

import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Coffee Images')
@Controller('coffee-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Coffee Image',
    description: 'Create a new coffee image (admin only)',
  })
  @ApiBody({
    type: CreateProductImageDto,
  })
  @SwaggerCreated({
    message: 'Coffee image created successfully',
    data: {
      id: 1,
      productId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86',
      sortOrder: 1,
      createdAt: '2026-06-18T00:00:00.000Z',
    },
  })
  @SwaggerBadRequest('Invalid coffee image data')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can create coffee image')
  create(
    @Body()
    dto: CreateProductImageDto,
  ) {
    return this.productImagesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Coffee Images',
    description: 'Retrieve all coffee images',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        productId: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1517705008128-361805f42e86',
        sortOrder: 1,
      },
    ],
  })
  findAll() {
    return this.productImagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Coffee Image',
    description: 'Retrieve coffee image detail by id',
  })
  @SwaggerSuccess({
    data: {
      id: 1,
      productId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86',
      sortOrder: 1,
      createdAt: '2026-06-18T00:00:00.000Z',
    },
  })
  @SwaggerNotFound('Coffee image not found')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productImagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Coffee Image',
    description: 'Update coffee image by id (admin only)',
  })
  @ApiBody({
    type: UpdateProductImageDto,
  })
  @SwaggerSuccess({
    message: 'Coffee image updated successfully',
    data: {
      id: 1,
      productId: 1,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      sortOrder: 2,
    },
  })
  @SwaggerNotFound('Coffee image not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update coffee image')
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateProductImageDto,
  ) {
    return this.productImagesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Coffee Image',
    description: 'Delete coffee image by id (admin only)',
  })
  @SwaggerSuccess({
    message: 'Coffee image deleted successfully',
  })
  @SwaggerNotFound('Coffee image not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can delete coffee image')
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.productImagesService.remove(id);
  }
}
