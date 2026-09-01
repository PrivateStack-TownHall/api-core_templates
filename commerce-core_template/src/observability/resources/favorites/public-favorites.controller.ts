import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicFavoritesService } from './public-favorites.service';

import { SwaggerSuccess } from '../../../common/swagger/swagger-response';

@ApiTags('Public Favorites')
@Controller('public/favorites')
export class PublicFavoritesController {
  constructor(
    private readonly publicFavoritesService: PublicFavoritesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all public favorites',
    description: 'Unauthenticated, unscoped list across every user (dashboard/demo use).',
  })
  @SwaggerSuccess({
    success: true,
    data: [
      {
        id: 1,
        userId: 1,
        productId: 1,
        user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
        product: {
          id: 1,
          name: 'Espresso',
          description: 'Strong espresso shot',
          price: 25000,
          stock: 100,
          isActive: true,
        },
      },
    ],
  })
  findAll() {
    return this.publicFavoritesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get public favorite by id',
    description: 'Returns { data: null } instead of a 404 when the id does not exist.',
  })
  @SwaggerSuccess({
    success: true,
    data: {
      id: 1,
      userId: 1,
      productId: 1,
      user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
      product: {
        id: 1,
        name: 'Espresso',
        description: 'Strong espresso shot',
        price: 25000,
        stock: 100,
        isActive: true,
      },
    },
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.publicFavoritesService.findOne(id);
  }
}
