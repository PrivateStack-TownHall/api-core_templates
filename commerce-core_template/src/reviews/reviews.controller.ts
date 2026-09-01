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

import { ReviewsService } from './reviews.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { type AuthRequest } from '../common/interfaces/auth-request.interface';

import {
  SwaggerBadRequest,
  SwaggerCreated,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Reviews',
    description: 'Retrieve all coffee reviews',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        userId: 1,
        productId: 1,
        rating: 5,
        comment: 'Excellent coffee',
        createdAt: '2026-06-17T00:00:00.000Z',
      },
    ],
  })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({
    summary: 'Get Reviews By Coffee',
    description: 'Retrieve reviews by coffee id',
  })
  @SwaggerSuccess({
    data: [
      {
        id: 1,
        userId: 1,
        productId: 1,
        rating: 5,
        comment: 'Excellent coffee',
      },
    ],
  })
  @SwaggerNotFound('Coffee not found')
  findByProduct(
    @Param('productId', ParseIntPipe)
    productId: number,
  ) {
    return this.reviewsService.findByProduct(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Review',
    description: 'Create review for coffee',
  })
  @ApiBody({
    type: CreateReviewDto,
  })
  @SwaggerCreated({
    message: 'Review created successfully',
    data: {
      id: 1,
      userId: 1,
      productId: 1,
      rating: 5,
      comment: 'Excellent coffee',
    },
  })
  @SwaggerBadRequest('Review already exists')
  @SwaggerUnauthorized()
  create(@Req() req: AuthRequest, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Review',
    description: 'Update review by id',
  })
  @ApiBody({
    type: UpdateReviewDto,
  })
  @SwaggerSuccess({
    message: 'Review updated successfully',
    data: {
      id: 1,
      rating: 4,
      comment: 'Good coffee, updated review',
    },
  })
  @SwaggerNotFound('Review not found')
  @SwaggerUnauthorized()
  update(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Review',
    description: 'Delete review by id',
  })
  @SwaggerSuccess({
    message: 'Review deleted successfully',
  })
  @SwaggerNotFound('Review not found')
  @SwaggerUnauthorized()
  remove(
    @Req() req: AuthRequest,

    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.reviewsService.remove(id, req.user.id);
  }
}
