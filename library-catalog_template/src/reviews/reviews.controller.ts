import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  SwaggerBadRequest,
  SwaggerConflict,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerNotFound,
  SwaggerSuccess,
  SwaggerUnauthorized,
} from '../common/swagger/swagger-response';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('books/:bookId/reviews')
  @ApiOperation({ summary: 'Get Reviews of a Book' })
  @SwaggerSuccess({ data: [] })
  findByBook(@Param('bookId') bookId: string) {
    return this.reviewsService.findByBook(bookId);
  }

  @Post('books/:bookId/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add Review to Book',
    description: 'One review per user per book',
  })
  @ApiBody({ type: CreateReviewDto })
  @SwaggerCreated({ message: 'Review added successfully', data: {} })
  @SwaggerBadRequest()
  @SwaggerConflict('You have already reviewed this book')
  @SwaggerUnauthorized()
  @SwaggerNotFound('Book not found')
  create(
    @Param('bookId') bookId: string,
    @Req() req: AuthRequest,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(bookId, req.user.id, dto);
  }

  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Review',
    description: 'Owner or admin only',
  })
  @ApiBody({ type: UpdateReviewDto })
  @SwaggerSuccess({ message: 'Review updated successfully', data: {} })
  @SwaggerNotFound('Review not found')
  @SwaggerForbidden('You can only update your own review')
  update(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(
      id,
      req.user.id,
      req.user.role as any,
      dto,
    );
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Review',
    description: 'Owner or admin only',
  })
  @SwaggerSuccess({ message: 'Review deleted successfully' })
  @SwaggerNotFound('Review not found')
  @SwaggerForbidden('You can only delete your own review')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.reviewsService.remove(id, req.user.id, req.user.role as any);
  }
}
