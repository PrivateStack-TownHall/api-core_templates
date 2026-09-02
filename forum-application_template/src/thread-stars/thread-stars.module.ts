import { Module } from '@nestjs/common';
import { ThreadStarsController } from './thread-stars.controller';
import { ThreadStarsService } from './thread-stars.service';

@Module({
  controllers: [ThreadStarsController],
  providers: [ThreadStarsService],
})
export class ThreadStarsModule {}
