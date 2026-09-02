import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryBookDto {
  @ApiPropertyOptional({ example: 'harry potter' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by genre id' })
  @IsOptional()
  @IsUUID()
  genreId?: string;
}
