import { PrismaClient } from '@prisma/client';

import { seedUsers } from './seeds/users.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedCoffees } from './seeds/coffees.seed';
import { seedCoffeeImages } from './seeds/coffee-images.seed';
import { seedReviews } from './seeds/reviews.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start Seeding...');

  await seedUsers(prisma);

  await seedCategories(prisma);

  await seedCoffees(prisma);

  await seedCoffeeImages(prisma);

  await seedReviews(prisma);

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
