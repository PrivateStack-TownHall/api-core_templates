import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthModule } from './observability/health/health.module';
import { StatsModule } from './observability/stats/stats.module';

import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { WarehouseLocationsModule } from './warehouse-locations/warehouse-locations.module';
import { StocksModule } from './stocks/stocks.module';
import { MovementsModule } from './movements/movements.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { TransfersModule } from './transfers/transfers.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    PrismaModule,

    UsersModule,
    AuthModule,

    ProductCategoriesModule,
    BrandsModule,
    ProductsModule,
    WarehousesModule,
    WarehouseLocationsModule,
    StocksModule,
    MovementsModule,
    SuppliersModule,
    PurchasesModule,
    TransfersModule,
    SettingsModule,

    AuditLogsModule,
    HealthModule,
    StatsModule,
  ],
})
export class AppModule {}
