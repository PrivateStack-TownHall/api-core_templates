import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicCartService } from './public-cart.service';

import { SwaggerSuccess } from '../../../common/swagger/swagger-response';

@ApiTags('Public Cart')
@Controller('public/cart')
export class PublicCartController {
  constructor(private readonly publicCartService: PublicCartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all public cart items',
    description: 'Unauthenticated, unscoped list across every user (dashboard/demo use).',
  })
  @SwaggerSuccess({
    success: true,
    data: [
      {
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 2,
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
    return this.publicCartService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get public cart item by id',
    description: 'Returns { data: null } instead of a 404 when the id does not exist.',
  })
  @SwaggerSuccess({
    success: true,
    data: {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2,
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
    return this.publicCartService.findOne(id);
  }
}
