import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsInt, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  productId!: number;

  @ApiProperty({
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
