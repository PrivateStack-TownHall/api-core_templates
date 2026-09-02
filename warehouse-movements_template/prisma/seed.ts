import { PrismaClient } from '@prisma/client';
import { seedProductCategories } from './seeds/product-categories.seed';
import { seedBrands } from './seeds/brands.seed';
import { seedWarehouses } from './seeds/warehouses.seed';
import { seedUsers } from './seeds/users.seed';
import { seedWarehouseLocations } from './seeds/warehouse-locations.seed';
import { seedProducts } from './seeds/products.seed';
import { seedStocks } from './seeds/stocks.seed';
import { seedMovements } from './seeds/movements.seed';
import { seedSuppliers } from './seeds/suppliers.seed';
import { seedPurchases } from './seeds/purchases.seed';
import { seedTransfers } from './seeds/transfers.seed';
import { seedSettings } from './seeds/settings.seed';
import { seedAuditLogs } from './seeds/audit-logs.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('📦 Start Seeding WareTrack...');

  const categories = await seedProductCategories(prisma);
  console.log(`  ✓ ${categories.length} product categories`);

  const brands = await seedBrands(prisma);
  console.log(`  ✓ ${brands.length} brands`);

  const warehouses = await seedWarehouses(prisma);
  console.log(`  ✓ ${warehouses.length} warehouses`);

  const users = await seedUsers(prisma, warehouses);
  console.log(`  ✓ ${users.length} users`);

  const locations = await seedWarehouseLocations(prisma, warehouses);
  console.log(`  ✓ ${locations.length} warehouse locations`);

  const products = await seedProducts(prisma, categories, brands);
  console.log(`  ✓ ${products.length} products`);

  const stocks = await seedStocks(prisma, warehouses, locations, products);
  console.log(`  ✓ ${stocks.length} stocks`);

  const movements = await seedMovements(prisma, stocks);
  console.log(`  ✓ ${movements.length} movements`);

  const suppliers = await seedSuppliers(prisma);
  console.log(`  ✓ ${suppliers.length} suppliers`);

  const purchases = await seedPurchases(prisma, suppliers, products);
  console.log(`  ✓ ${purchases.length} purchases`);

  const transfers = await seedTransfers(prisma, warehouses, products);
  console.log(`  ✓ ${transfers.length} transfers`);

  const settings = await seedSettings(prisma);
  console.log(`  ✓ ${settings.length} settings (singleton by design)`);

  const auditLogs = await seedAuditLogs(prisma, users, products);
  console.log(`  ✓ ${auditLogs.length} audit logs`);

  console.log('✅ Seeding Completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
