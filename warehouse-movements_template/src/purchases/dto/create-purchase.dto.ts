import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class PurchaseItemInput {
  @ApiProperty() @IsUUID() productId!: string;
  @ApiProperty({ example: 100 }) @IsNumber() @Min(1) quantity!: number;
  @ApiProperty({ example: 50000 }) @IsNumber() @Min(0) price!: number;
}

export class CreatePurchaseDto {
  @ApiProperty() @IsUUID() supplierId!: string;
  @ApiProperty({ example: 'INV-2026-001' }) @IsString() invoice!: string;
  @ApiProperty({ example: '2026-01-15' }) @IsDateString() purchaseDate!: string;

  @ApiProperty({ type: [PurchaseItemInput] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemInput)
  items!: PurchaseItemInput[];
}
