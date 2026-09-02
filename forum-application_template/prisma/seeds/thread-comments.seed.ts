export async function seedThreadComments(prisma: any, users: any[], threads: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');

  const commentBodies = [
    'This helped me a lot, thanks for sharing!',
    'I had the exact same issue last week.',
    'Great write-up, very clear explanation.',
    'Have you tried the official docs on this?',
    'Interesting take, I disagree with point 2 though.',
  ];

  const comments: any[] = [];
  for (let i = 0; i < commentBodies.length; i++) {
    const thread = threads[i % threads.length];
    const author = members[i % members.length];

    const comment = await prisma.threadComment.create({
      data: { threadId: thread.id, userId: author.id, body: commentBodies[i] },
    });
    comments.push(comment);
  }

  return comments;
}
