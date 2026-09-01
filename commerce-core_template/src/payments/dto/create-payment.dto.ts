import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsInt } from 'class-validator';

import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  orderId!: number;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}
