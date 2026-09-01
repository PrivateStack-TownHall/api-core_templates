import { IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Milk Based',
    description: 'Coffee category name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Coffee drinks mixed with milk',
    description: 'Category description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
