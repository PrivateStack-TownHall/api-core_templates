import {
  Body,
  Controller,
  Delete,
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

import { CartService } from './cart.service';

import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { type AuthRequest } from '../common/interfaces/auth-request.interface';

import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({
    summary: 'Add To Cart',
    description: 'Add product to current user cart',
  })
  @ApiBody({
    type: CreateCartDto,
  })
  @SwaggerCreated({
    message: 'Added to cart successfully',
    data: {
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2,
    },
  })
  @SwaggerBadRequest('Product not found')
  @SwaggerUnauthorized()
  create(@Req() req: AuthRequest, @Body() dto: CreateCartDto) {
    return this.cartService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Cart',
    description: 'Get current user cart items',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        productId: 1,
        quantity: 2,
        product: {
          id: 1,
          name: 'Espresso',
          price: 25000,
        },
      },
    ],
  })
  @SwaggerUnauthorized()
  findAll(@Req() req: AuthRequest) {
    return this.cartService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Cart Item',
    description: 'Get cart item detail by id',
  })
  @SwaggerSuccess({
    data: {
      id: 1,
      productId: 1,
      quantity: 2,
    },
  })
  @SwaggerNotFound('Cart item not found')
  @SwaggerUnauthorized()
  findOne(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.cartService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Cart Item',
    description: 'Update cart item quantity',
  })
  @ApiBody({
    type: UpdateCartDto,
  })
  @SwaggerSuccess({
    message: 'Cart updated successfully',
    data: {
      id: 1,
      quantity: 5,
    },
  })
  @SwaggerNotFound('Cart item not found')
  @SwaggerUnauthorized()
  update(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateCartDto,
  ) {
    return this.cartService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove Cart Item',
    description: 'Remove item from cart',
  })
  @SwaggerSuccess({
    message: 'Cart item removed successfully',
  })
  @SwaggerNotFound('Cart item not found')
  @SwaggerUnauthorized()
  remove(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.cartService.remove(id, req.user.id);
  }
}
