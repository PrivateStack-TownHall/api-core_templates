import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: any) {
  const password = await bcrypt.hash('123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { fullName: 'Admin M-ployee', email: 'admin@mployee.com', password, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: { fullName: 'Budi Santoso', email: 'budi@example.com', password, role: 'MEMBER' },
    }),
    prisma.user.create({
      data: { fullName: 'Sarah Mitchell', email: 'sarah@example.com', password, role: 'MEMBER' },
    }),
  ]);

  return users;
}
