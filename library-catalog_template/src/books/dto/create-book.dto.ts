import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: "Harry Potter and the Philosopher's Stone" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: '9780747532699' })
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @ApiProperty({ description: 'ID publisher' })
  @IsUUID()
  publisherId!: string;

  @ApiPropertyOptional({ example: 1997 })
  @IsOptional()
  @IsInt()
  publishedYear?: number;
  @ApiPropertyOptional({
    example: 'A young wizard discovers his magical heritage...',
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiPropertyOptional({ example: 'https://example.com/covers/hp1.jpg' })
  @IsOptional()
  @IsString()
  coverUrl?: string;
  @ApiPropertyOptional({ example: 3, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalCopies?: number;

  @ApiPropertyOptional({ type: [String], description: 'Array of author IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  authorIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Array of genre IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  genreIds?: string[];
}
