import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: any) {
  const password = await bcrypt.hash('123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { fullName: 'Admin Leather Shelf', email: 'admin@leathershelf.com', password, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: { fullName: 'Haruto Sato', email: 'haruto@example.com', password, role: 'MEMBER', membershipNumber: 'MBR-001', favoriteGenre: 'Fantasy' },
    }),
    prisma.user.create({
      data: { fullName: 'Michelle Lam', email: 'michelle@example.com', password, role: 'MEMBER', membershipNumber: 'MBR-002', favoriteGenre: 'Mystery' },
    }),
  ]);

  return users;
}
