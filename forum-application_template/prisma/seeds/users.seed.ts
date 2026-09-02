import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: any) {
  const password = await bcrypt.hash('123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { fullName: 'Admin Pineapple', email: 'admin@pineapplestack.com', password, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: { fullName: 'James Anderson', email: 'james@example.com', password, role: 'MEMBER', bio: 'Full-stack developer.' },
    }),
    prisma.user.create({
      data: { fullName: 'Yuki Tanaka', email: 'yuki@example.com', password, role: 'MEMBER', bio: 'Loves backend architecture.' },
    }),
  ]);

  return users;
}
