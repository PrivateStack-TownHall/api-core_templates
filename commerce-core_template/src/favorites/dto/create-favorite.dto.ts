import { IsInt } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 1,
    description: 'Coffee id to add into favorites',
  })
  @IsInt()
  productId!: number;
}
