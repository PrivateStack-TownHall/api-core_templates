import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateEmployeeProfileDto {
  @ApiProperty({
    description: 'ID user (harus sudah register lewat /auth/register)',
  })
  @IsUUID()
  userId!: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() jobId?: string;
  @ApiPropertyOptional({ example: '081234567890' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  hireDate?: string;
  @ApiPropertyOptional({ example: 8500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() image?: string;
}
