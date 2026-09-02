export async function seedAuditLogs(prisma: any, users: any[], posts: any[]) {
  const logs: any[] = [];

  const logData = [
    { action: 'REGISTER', entity: 'User' },
    { action: 'LOGIN', entity: 'User' },
    { action: 'CREATE_POST', entity: 'Post' },
  ];

  for (let i = 0; i < logData.length; i++) {
    const user = users[i % users.length];
    const entityId = logData[i].entity === 'Post' ? posts[i % posts.length].id : user.id;

    const log = await prisma.auditLog.create({
      data: { userId: user.id, action: logData[i].action, entity: logData[i].entity, entityId, appType: 'CODIGRAM' },
    });
    logs.push(log);
  }

  return logs;
}
