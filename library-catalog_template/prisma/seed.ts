import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedAuthors } from './seeds/authors.seed';
import { seedPublishers } from './seeds/publishers.seed';
import { seedGenres } from './seeds/genres.seed';
import { seedBooks } from './seeds/books.seed';
import { seedReviews } from './seeds/reviews.seed';
import { seedAuditLogs } from './seeds/audit-logs.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('📚 Start Seeding Leather Shelf...');

  const users = await seedUsers(prisma);
  console.log(`  ✓ ${users.length} users`);

  const authors = await seedAuthors(prisma);
  console.log(`  ✓ ${authors.length} authors`);

  const publishers = await seedPublishers(prisma);
  console.log(`  ✓ ${publishers.length} publishers`);

  const genres = await seedGenres(prisma);
  console.log(`  ✓ ${genres.length} genres`);

  const books = await seedBooks(prisma, authors, publishers, genres);
  console.log(`  ✓ ${books.length} books`);

  const reviews = await seedReviews(prisma, users, books);
  console.log(`  ✓ ${reviews.length} reviews`);

  const auditLogs = await seedAuditLogs(prisma, users, books);
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
