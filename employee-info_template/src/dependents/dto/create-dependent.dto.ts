import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDependentDto {
  @ApiProperty({ description: 'ID employee profile' })
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: 'Rina' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;
  @ApiProperty({ example: 'Santoso' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;
  @ApiPropertyOptional({ example: 'Spouse' })
  @IsOptional()
  @IsString()
  relationship?: string;
}
