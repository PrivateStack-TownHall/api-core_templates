import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty() @IsUUID() categoryId!: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() brandId?: string;

  @ApiProperty({ example: 'SKU-001' }) @IsString() @IsNotEmpty() sku!: string;
  @ApiPropertyOptional({ example: '8991234567890' })
  @IsOptional()
  @IsString()
  barcode?: string;
  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ example: 'pcs' }) @IsString() @IsNotEmpty() unit!: string;

  @ApiProperty({ example: 50000 }) @IsNumber() @Min(0) costPrice!: number;
  @ApiProperty({ example: 75000 }) @IsNumber() @Min(0) sellingPrice!: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumQty?: number;
  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maximumQty?: number;
}
