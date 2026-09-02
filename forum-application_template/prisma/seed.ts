import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedThreads } from './seeds/threads.seed';
import { seedThreadComments } from './seeds/thread-comments.seed';
import { seedThreadLikes } from './seeds/thread-likes.seed';
import { seedThreadStars } from './seeds/thread-stars.seed';
import { seedNotifications } from './seeds/notifications.seed';
import { seedAuditLogs } from './seeds/audit-logs.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🍍 Start Seeding Pineapple Stack...');

  const users = await seedUsers(prisma);
  console.log(`  ✓ ${users.length} users`);

  const threads = await seedThreads(prisma, users);
  console.log(`  ✓ ${threads.length} threads`);

  const comments = await seedThreadComments(prisma, users, threads);
  console.log(`  ✓ ${comments.length} thread comments`);

  const likes = await seedThreadLikes(prisma, users, threads);
  console.log(`  ✓ ${likes.length} thread likes`);

  const stars = await seedThreadStars(prisma, users, threads);
  console.log(`  ✓ ${stars.length} thread stars`);

  const notifications = await seedNotifications(prisma, users, threads);
  console.log(`  ✓ ${notifications.length} notifications`);

  const auditLogs = await seedAuditLogs(prisma, users, threads);
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
