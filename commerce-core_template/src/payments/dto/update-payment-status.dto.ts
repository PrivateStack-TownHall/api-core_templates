import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.SUCCESS,
  })
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}
