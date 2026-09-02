export async function seedThreads(prisma: any, users: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');

  const threadsData = [
    { title: 'How to deploy NestJS to Render?', category: 'deployment', body: 'I keep getting build errors when deploying my NestJS app to Render. Anyone been through this?' },
    { title: 'Best practices for Prisma migrations', category: 'database', body: 'What is the safest way to run migrations in production without downtime?' },
    { title: 'JWT vs Session authentication', category: 'auth', body: 'Trying to decide between JWT and session-based auth for a new project. Thoughts?' },
    { title: 'Tips for writing clean DTOs', category: 'general', body: 'Share your favorite patterns for keeping DTOs maintainable as the app grows.' },
  ];

  const threads: any[] = [];
  for (let i = 0; i < threadsData.length; i++) {
    const t = threadsData[i];
    const author = members[i % members.length];
    const slug = `${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`;

    const thread = await prisma.thread.create({
      data: { userId: author.id, title: t.title, slug, body: t.body, category: t.category },
    });
    threads.push(thread);
  }

  return threads;
}
