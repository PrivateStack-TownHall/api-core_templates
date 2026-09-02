import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadCommentDto } from './create-thread-comment.dto';

export class UpdateThreadCommentDto extends PartialType(
  CreateThreadCommentDto,
) {}
