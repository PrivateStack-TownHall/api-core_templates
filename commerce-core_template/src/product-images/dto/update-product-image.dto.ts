import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductImageDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1544025162-d76694265947',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 2,
  })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
