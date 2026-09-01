import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicOrdersService } from './public-orders.service';

import { SwaggerSuccess } from '../../../common/swagger/swagger-response';

@ApiTags('Public Orders')
@Controller('public/orders')
export class PublicOrdersController {
  constructor(private readonly publicOrdersService: PublicOrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all public orders',
    description: 'Unauthenticated, unscoped list across every user (dashboard/demo use).',
  })
  @SwaggerSuccess({
    success: true,
    data: [
      {
        id: 1,
        orderNumber: 'KB-1750000000000',
        userId: 1,
        totalAmount: 50000,
        status: 'PENDING',
        user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
        items: [
          {
            id: 1,
            productId: 1,
            productName: 'Espresso',
            price: 25000,
            quantity: 2,
            subtotal: 50000,
            product: { id: 1, name: 'Espresso', price: 25000 },
          },
        ],
        payments: [],
        histories: [
          { id: 1, orderId: 1, status: 'PENDING', notes: 'Order created' },
        ],
      },
    ],
  })
  findAll() {
    return this.publicOrdersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get public order by id',
    description: 'Returns { data: null } instead of a 404 when the id does not exist.',
  })
  @SwaggerSuccess({
    success: true,
    data: {
      id: 1,
      orderNumber: 'KB-1750000000000',
      userId: 1,
      totalAmount: 50000,
      status: 'PENDING',
      user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'Espresso',
          price: 25000,
          quantity: 2,
          subtotal: 50000,
          product: { id: 1, name: 'Espresso', price: 25000 },
        },
      ],
      payments: [],
      histories: [
        { id: 1, orderId: 1, status: 'PENDING', notes: 'Order created' },
      ],
    },
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.publicOrdersService.findOne(id);
  }
}
