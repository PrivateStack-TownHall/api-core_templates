import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @ApiProperty({
    example: 'Preparing coffee',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
