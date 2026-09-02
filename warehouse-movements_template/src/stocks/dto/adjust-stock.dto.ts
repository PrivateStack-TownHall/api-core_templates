import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class AdjustStockDto {
  @ApiProperty({
    example: 10,
    description: 'Positive to add, negative to subtract',
  })
  @IsInt()
  quantity!: number;

  @ApiProperty({
    enum: ['PURCHASE', 'SALE', 'TRANSFER', 'ADJUSTMENT'],
    example: 'ADJUSTMENT',
  })
  @IsIn(['PURCHASE', 'SALE', 'TRANSFER', 'ADJUSTMENT'])
  type!: 'PURCHASE' | 'SALE' | 'TRANSFER' | 'ADJUSTMENT';

  @ApiPropertyOptional({ example: 'Stock opname correction' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
