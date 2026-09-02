export async function seedNotifications(prisma: any, users: any[], threads: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');
  const notifications: any[] = [];

  const notifData = [
    { type: 'THREAD_LIKED', isRead: true },
    { type: 'THREAD_COMMENTED', isRead: false },
    { type: 'THREAD_LIKED', isRead: false },
  ];

  for (let i = 0; i < notifData.length; i++) {
    const thread = threads[i % threads.length];
    const recipient = members[i % members.length];
    const actor = members[(i + 1) % members.length];

    const notification = await prisma.notification.create({
      data: {
        recipientId: recipient.id,
        actorId: actor.id,
        type: notifData[i].type,
        entityType: 'Thread',
        entityId: thread.id,
        isRead: notifData[i].isRead,
      },
    });
    notifications.push(notification);
  }

  return notifications;
}
