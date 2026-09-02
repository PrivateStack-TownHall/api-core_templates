import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdatePurchaseStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    example: 'COMPLETED',
  })
  @IsIn(['PENDING', 'COMPLETED', 'CANCELLED'])
  status!: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}
