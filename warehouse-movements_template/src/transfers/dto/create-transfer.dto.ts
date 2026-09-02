import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class TransferItemInput {
  @ApiProperty() @IsUUID() productId!: string;
  @ApiProperty({ example: 20 }) @IsNumber() @Min(1) quantity!: number;
}

export class CreateTransferDto {
  @ApiProperty({ example: 'TRF-2026-001' }) @IsString() code!: string;
  @ApiProperty() @IsUUID() fromWarehouseId!: string;
  @ApiProperty() @IsUUID() toWarehouseId!: string;

  @ApiProperty({ type: [TransferItemInput] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TransferItemInput)
  items!: TransferItemInput[];
}
