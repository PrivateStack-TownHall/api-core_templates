export async function seedAuditLogs(prisma: any, users: any[], employeeProfiles: any[]) {
  const logData = [
    { action: 'REGISTER', entity: 'User' },
    { action: 'LOGIN', entity: 'User' },
    { action: 'CREATE_EMPLOYEE_PROFILE', entity: 'EmployeeProfile' },
  ];

  const logs: any[] = [];
  for (let i = 0; i < logData.length; i++) {
    const user = users[i % users.length];
    const entityId = logData[i].entity === 'EmployeeProfile' ? employeeProfiles[i % employeeProfiles.length].id : user.id;

    const log = await prisma.auditLog.create({
      data: { userId: user.id, action: logData[i].action, entity: logData[i].entity, entityId, appType: 'MPLOYEE' },
    });
    logs.push(log);
  }

  return logs;
}
