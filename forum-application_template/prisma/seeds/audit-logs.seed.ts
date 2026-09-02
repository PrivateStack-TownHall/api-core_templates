export async function seedAuditLogs(prisma: any, users: any[], threads: any[]) {
  const logs: any[] = [];

  const logData = [
    { action: 'REGISTER', entity: 'User' },
    { action: 'LOGIN', entity: 'User' },
    { action: 'CREATE_THREAD', entity: 'Thread' },
  ];

  for (let i = 0; i < logData.length; i++) {
    const user = users[i % users.length];
    const entityId = logData[i].entity === 'Thread' ? threads[i % threads.length].id : user.id;

    const log = await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: logData[i].action,
        entity: logData[i].entity,
        entityId,
        appType: 'PINEAPPLE',
      },
    });
    logs.push(log);
  }

  return logs;
}
