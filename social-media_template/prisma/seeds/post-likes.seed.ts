export async function seedPostLikes(prisma: any, users: any[], posts: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');
  const likes: any[] = [];

  for (const member of members) {
    for (const post of posts) {
      if (post.userId === member.id) continue;

      const exists = await prisma.postLike.findUnique({
        where: { userId_postId: { userId: member.id, postId: post.id } },
      });
      if (exists) continue;

      const like = await prisma.postLike.create({ data: { userId: member.id, postId: post.id } });
      likes.push(like);
    }
  }

  return likes;
}
