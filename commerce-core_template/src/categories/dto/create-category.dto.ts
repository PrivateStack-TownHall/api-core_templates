import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Espresso Based',
    description: 'Coffee category name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Coffee drinks based on espresso',
    description: 'Category description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
