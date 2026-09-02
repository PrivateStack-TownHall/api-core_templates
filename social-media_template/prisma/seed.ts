import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedPostCategories } from './seeds/post-categories.seed';
import { seedPosts } from './seeds/posts.seed';
import { seedPostComments } from './seeds/post-comments.seed';
import { seedPostLikes } from './seeds/post-likes.seed';
import { seedNotifications } from './seeds/notifications.seed';
import { seedAuditLogs } from './seeds/audit-logs.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('📸 Start Seeding Codigram...');

  const users = await seedUsers(prisma);
  console.log(`  ✓ ${users.length} users`);

  const categories = await seedPostCategories(prisma);
  console.log(`  ✓ ${categories.length} post categories`);

  const posts = await seedPosts(prisma, users, categories);
  console.log(`  ✓ ${posts.length} posts`);

  const comments = await seedPostComments(prisma, users, posts);
  console.log(`  ✓ ${comments.length} post comments`);

  const likes = await seedPostLikes(prisma, users, posts);
  console.log(`  ✓ ${likes.length} post likes`);

  const notifications = await seedNotifications(prisma, users, posts);
  console.log(`  ✓ ${notifications.length} notifications`);

  const auditLogs = await seedAuditLogs(prisma, users, posts);
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
