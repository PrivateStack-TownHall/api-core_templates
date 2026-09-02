import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostCommentDto {
  @ApiProperty({ example: 'Amazing photo!' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
