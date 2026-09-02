import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThreadCommentDto {
  @ApiProperty({ example: 'Great thread, thanks for sharing!' })
  @IsString()
  @IsNotEmpty()
  body!: string;
}
