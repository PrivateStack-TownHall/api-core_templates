import { Module } from '@nestjs/common';
import { ThreadLikesController } from './thread-likes.controller';
import { ThreadLikesService } from './thread-likes.service';

@Module({
  controllers: [ThreadLikesController],
  providers: [ThreadLikesService],
})
export class ThreadLikesModule {}
