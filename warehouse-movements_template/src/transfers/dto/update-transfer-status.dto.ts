import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateTransferStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'],
    example: 'IN_TRANSIT',
  })
  @IsIn(['PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'])
  status!: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}
