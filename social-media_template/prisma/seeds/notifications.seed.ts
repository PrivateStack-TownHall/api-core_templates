export async function seedNotifications(prisma: any, users: any[], posts: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');
  const notifications: any[] = [];

  const notifData = [
    { type: 'POST_LIKED', isRead: true },
    { type: 'POST_COMMENTED', isRead: false },
    { type: 'POST_LIKED', isRead: false },
  ];

  for (let i = 0; i < notifData.length; i++) {
    const post = posts[i % posts.length];
    const recipient = members[i % members.length];
    const actor = members[(i + 1) % members.length];

    const notification = await prisma.notification.create({
      data: {
        recipientId: recipient.id,
        actorId: actor.id,
        type: notifData[i].type,
        entityType: 'Post',
        entityId: post.id,
        isRead: notifData[i].isRead,
      },
    });
    notifications.push(notification);
  }

  return notifications;
}
