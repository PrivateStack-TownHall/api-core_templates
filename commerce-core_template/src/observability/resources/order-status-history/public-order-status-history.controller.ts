import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicOrderStatusHistoryService } from './public-order-status-history.service';

import { SwaggerSuccess } from '../../../common/swagger/swagger-response';

@ApiTags('Public Order Status History')
@Controller('public/order-status-history')
export class PublicOrderStatusHistoryController {
  constructor(
    private readonly publicOrderStatusHistoryService: PublicOrderStatusHistoryService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all public order status histories',
    description: 'Unauthenticated, unscoped list across every user (dashboard/demo use).',
  })
  @SwaggerSuccess({
    success: true,
    data: [
      {
        id: 1,
        orderId: 1,
        status: 'PENDING',
        notes: 'Order created',
        order: {
          id: 1,
          orderNumber: 'KB-1750000000000',
          user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
          items: [
            { id: 1, productId: 1, product: { id: 1, name: 'Espresso', price: 25000 } },
          ],
          payments: [],
        },
      },
    ],
  })
  findAll() {
    return this.publicOrderStatusHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get public order status history by id',
    description: 'Returns { data: null } instead of a 404 when the id does not exist.',
  })
  @SwaggerSuccess({
    success: true,
    data: {
      id: 1,
      orderId: 1,
      status: 'PENDING',
      notes: 'Order created',
      order: {
        id: 1,
        orderNumber: 'KB-1750000000000',
        user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
        items: [
          { id: 1, productId: 1, product: { id: 1, name: 'Espresso', price: 25000 } },
        ],
        payments: [],
      },
    },
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.publicOrderStatusHistoryService.findOne(id);
  }
}
