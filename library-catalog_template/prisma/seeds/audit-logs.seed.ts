export async function seedAuditLogs(prisma: any, users: any[], books: any[]) {
  const logData = [
    { action: 'REGISTER', entity: 'User' },
    { action: 'LOGIN', entity: 'User' },
    { action: 'CREATE_REVIEW', entity: 'Review' },
  ];

  const logs: any[] = [];
  for (let i = 0; i < logData.length; i++) {
    const user = users[i % users.length];
    const entityId = logData[i].entity === 'Review' ? books[i % books.length].id : user.id;

    const log = await prisma.auditLog.create({
      data: { userId: user.id, action: logData[i].action, entity: logData[i].entity, entityId, appType: 'LEATHER' },
    });
    logs.push(log);
  }

  return logs;
}
