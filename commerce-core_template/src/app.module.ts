import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { FavoritesModule } from './favorites/favorites.module';
import { OrderStatusHistoryModule } from './order-status-history/order-status-history.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

import { ActivitiesModule } from './observability/activities/activities.module';
import { HealthModule } from './observability/health/health.module';
import { MonitoringModule } from './observability/monitoring/monitoring.module';
import { ResourcesModule } from './observability/resources/resources.module';
import { StatsModule } from './observability/stats/stats.module';

@Module({
  imports: [
    PrismaModule,

    UsersModule,
    AuthModule,

    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    FavoritesModule,
    ReviewsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    OrderStatusHistoryModule,
    AuditLogsModule,

    HealthModule,
    StatsModule,
    ActivitiesModule,
    MonitoringModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
