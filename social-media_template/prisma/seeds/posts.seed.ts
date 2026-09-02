export async function seedPosts(prisma: any, users: any[], categories: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');

  const captions = [
    'Beautiful sunset at the beach today! 🌅',
    'Best ramen I have ever had 🍜',
    'Just got my new laptop, so excited!',
    'Morning coffee hits different ☕',
  ];

  const posts: any[] = [];
  for (let i = 0; i < captions.length; i++) {
    const author = members[i % members.length];
    const category = categories[i % categories.length];

    const post = await prisma.post.create({
      data: { userId: author.id, categoryId: category.id, caption: captions[i] },
    });
    posts.push(post);
  }

  return posts;
}
