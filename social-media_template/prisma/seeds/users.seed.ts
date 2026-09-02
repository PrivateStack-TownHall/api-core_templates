import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: any) {
  const password = await bcrypt.hash('123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { fullName: 'Admin Codigram', email: 'admin@codigram.com', password, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: { fullName: 'Chloe Cheung', email: 'chloe@example.com', password, role: 'MEMBER', bio: 'Travel photographer.' },
    }),
    prisma.user.create({
      data: { fullName: 'Wei Zhang', email: 'wei@example.com', password, role: 'MEMBER', bio: 'Food blogger.' },
    }),
  ]);

  return users;
}
