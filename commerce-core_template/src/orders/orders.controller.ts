import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

import { OrdersService } from './orders.service';

import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

import { type AuthRequest } from '../common/interfaces/auth-request.interface';

import {
  SwaggerBadRequest,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({
    summary: 'Checkout Cart',
    description: 'Create order from current user cart items',
  })
  @SwaggerSuccess({
    message: 'Checkout successful',
    data: {
      id: 1,
      userId: 1,
      orderNumber: 'KB-1781668021085',
      totalAmount: 356000,
      status: 'PENDING',
    },
  })
  @SwaggerBadRequest('Cart is empty')
  @SwaggerUnauthorized()
  checkout(@Req() req: AuthRequest) {
    return this.ordersService.checkout(req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Orders',
    description: 'Retrieve current user orders',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        orderNumber: 'KB-1781668021085',
        totalAmount: 356000,
        status: 'PENDING',
      },
    ],
  })
  @SwaggerUnauthorized()
  findAll(@Req() req: AuthRequest) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Order',
    description: 'Retrieve order detail by id',
  })
  @SwaggerSuccess({
    data: {
      id: 1,
      orderNumber: 'KB-1781668021085',
      totalAmount: 356000,
      status: 'PENDING',
      items: [
        {
          id: 1,
          productName: 'Espresso',
          quantity: 2,
          price: 25000,
        },
      ],
    },
  })
  @SwaggerNotFound('Order not found')
  @SwaggerUnauthorized()
  findOne(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update Order Status',
    description: 'Update order status by id (admin only)',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
  })
  @SwaggerSuccess({
    message: 'Order status updated successfully',
    data: {
      id: 1,
      status: 'PROCESSING',
    },
  })
  @SwaggerNotFound('Order not found')
  @SwaggerUnauthorized()
  @SwaggerForbidden('Only admin can update order status')
  updateStatus(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
