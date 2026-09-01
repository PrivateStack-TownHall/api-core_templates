import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PublicPaymentsService } from './public-payments.service';

import { SwaggerSuccess } from '../../../common/swagger/swagger-response';

@ApiTags('Public Payments')
@Controller('public/payments')
export class PublicPaymentsController {
  constructor(private readonly publicPaymentsService: PublicPaymentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all public payments',
    description: 'Unauthenticated, unscoped list across every user (dashboard/demo use).',
  })
  @SwaggerSuccess({
    success: true,
    data: [
      {
        id: 1,
        orderId: 1,
        amount: 50000,
        method: 'BANK_TRANSFER',
        status: 'PENDING',
        order: {
          id: 1,
          orderNumber: 'KB-1750000000000',
          user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
          items: [
            { id: 1, productId: 1, product: { id: 1, name: 'Espresso', price: 25000 } },
          ],
        },
      },
    ],
  })
  findAll() {
    return this.publicPaymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get public payment by id',
    description: 'Returns { data: null } instead of a 404 when the id does not exist.',
  })
  @SwaggerSuccess({
    success: true,
    data: {
      id: 1,
      orderId: 1,
      amount: 50000,
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      order: {
        id: 1,
        orderNumber: 'KB-1750000000000',
        user: { id: 1, fullName: 'John Smith', email: 'john@example.com', role: 'CUSTOMER' },
        items: [
          { id: 1, productId: 1, product: { id: 1, name: 'Espresso', price: 25000 } },
        ],
      },
    },
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.publicPaymentsService.findOne(id);
  }
}
