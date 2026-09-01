import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { FavoritesService } from './favorites.service';

import { CreateFavoriteDto } from './dto/create-favorite.dto';

import { type AuthRequest } from '../common/interfaces/auth-request.interface';

import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({
    summary: 'Add Favorite',
    description: 'Add product to current user favorites',
  })
  @ApiBody({
    type: CreateFavoriteDto,
  })
  @SwaggerCreated({
    message: 'Favorite added successfully',
    data: {
      id: 1,
      userId: 1,
      productId: 1,
    },
  })
  @SwaggerBadRequest('Product already in favorites')
  @SwaggerUnauthorized()
  create(@Req() req: AuthRequest, @Body() dto: CreateFavoriteDto) {
    return this.favoritesService.create(req.user.id, dto.productId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Favorites',
    description: 'Retrieve current user favorite products',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        userId: 1,
        productId: 1,
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
    return this.favoritesService.findAll(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove Favorite',
    description: 'Remove favorite by id',
  })
  @SwaggerSuccess({
    message: 'Favorite removed successfully',
  })
  @SwaggerNotFound('Favorite not found')
  @SwaggerUnauthorized()
  remove(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.favoritesService.remove(id, req.user.id);
  }
}
