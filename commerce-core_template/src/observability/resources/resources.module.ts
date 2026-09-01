import { Module } from '@nestjs/common';

import { PublicCartModule } from './cart/public-cart.module';
import { PublicFavoritesModule } from './favorites/public-favorites.module';
import { PublicOrderStatusHistoryModule } from './order-status-history/public-order-status-history.module';
import { PublicOrdersModule } from './orders/public-orders.module';
import { PublicPaymentsModule } from './payments/public-payments.modules';

@Module({
  imports: [
    PublicOrdersModule,
    PublicPaymentsModule,
    PublicFavoritesModule,
    PublicCartModule,
    PublicOrderStatusHistoryModule,
  ],
})
export class ResourcesModule {}
