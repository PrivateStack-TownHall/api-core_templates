export async function seedThreadStars(prisma: any, users: any[], threads: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');
  const stars: any[] = [];

  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    // tiap member star 1-2 thread
    const picks = [threads[i % threads.length], threads[(i + 1) % threads.length]];

    for (const thread of picks) {
      const exists = await prisma.threadStar.findUnique({
        where: { userId_threadId: { userId: member.id, threadId: thread.id } },
      });
      if (exists) continue;

      const star = await prisma.threadStar.create({
        data: { userId: member.id, threadId: thread.id },
      });
      stars.push(star);
    }
  }

  return stars;
}
