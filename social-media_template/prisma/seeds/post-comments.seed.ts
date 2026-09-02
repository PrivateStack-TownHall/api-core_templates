export async function seedPostComments(prisma: any, users: any[], posts: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');

  const messages = [
    'Wow, amazing shot!',
    'This looks delicious 😋',
    'Where is this?',
    'Nice, congrats!',
    'Same here, love this.',
  ];

  const comments: any[] = [];
  for (let i = 0; i < messages.length; i++) {
    const post = posts[i % posts.length];
    const author = members[i % members.length];

    const comment = await prisma.postComment.create({
      data: { postId: post.id, userId: author.id, message: messages[i] },
    });
    comments.push(comment);
  }

  return comments;
}
