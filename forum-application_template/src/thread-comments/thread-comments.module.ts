import { Module } from '@nestjs/common';
import { ThreadCommentsController } from './thread-comments.controller';
import { ThreadCommentsService } from './thread-comments.service';

@Module({
  controllers: [ThreadCommentsController],
  providers: [ThreadCommentsService],
})
export class ThreadCommentsModule {}
