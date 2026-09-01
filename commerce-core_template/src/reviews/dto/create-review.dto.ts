import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'Coffee id to review',
  })
  @IsInt()
  productId!: number;

  @ApiProperty({
    example: 5,
    description: 'Rating from 1 to 5',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({
    example: 'Amazing coffee with rich aroma and smooth taste.',
    required: false,
    description: 'Customer review comment',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
