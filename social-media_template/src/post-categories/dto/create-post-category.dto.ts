import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({ example: 'Travel' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Posts about travel and adventure' })
  @IsOptional()
  @IsString()
  description?: string;
}
