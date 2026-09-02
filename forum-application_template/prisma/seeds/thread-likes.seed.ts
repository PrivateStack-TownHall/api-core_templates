export async function seedThreadLikes(prisma: any, users: any[], threads: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');
  const likes: any[] = [];

  // tiap member like beberapa thread (skip thread milik sendiri biar realistis)
  for (const member of members) {
    for (const thread of threads) {
      if (thread.userId === member.id) continue;

      const exists = await prisma.threadLike.findUnique({
        where: { userId_threadId: { userId: member.id, threadId: thread.id } },
      });
      if (exists) continue;

      const like = await prisma.threadLike.create({
        data: { userId: member.id, threadId: thread.id },
      });
      likes.push(like);
    }
  }

  return likes;
}
