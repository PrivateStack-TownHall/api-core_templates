import { Module } from '@nestjs/common';

import { OrderStatusHistoryController } from './order-status-history.controller';
import { OrderStatusHistoryService } from './order-status-history.service';

@Module({
  controllers: [OrderStatusHistoryController],
  providers: [OrderStatusHistoryService],
})
export class OrderStatusHistoryModule {}
