import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    example: 5,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
