import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'ID kategori post' })
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ example: 'Beautiful sunset at the beach today!' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'https://example.com/images/sunset.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
