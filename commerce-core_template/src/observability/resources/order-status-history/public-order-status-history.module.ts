import { Module } from '@nestjs/common';

import { PrismaModule } from '../../../prisma/prisma.module';

import { PublicOrderStatusHistoryController } from './public-order-status-history.controller';
import { PublicOrderStatusHistoryService } from './public-order-status-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicOrderStatusHistoryController],
  providers: [PublicOrderStatusHistoryService],
  exports: [PublicOrderStatusHistoryService],
})
export class PublicOrderStatusHistoryModule {}
