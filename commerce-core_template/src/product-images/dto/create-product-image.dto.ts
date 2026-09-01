import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsString } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  productId!: number;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1544025162-d76694265947',
  })
  @IsString()
  imageUrl!: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  sortOrder!: number;
}
