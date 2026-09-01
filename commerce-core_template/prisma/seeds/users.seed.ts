import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: any) {
  const password = await bcrypt.hash('123', 10);

  await prisma.user.createMany({
    data: [
      {
        fullName: 'Admin',
        email: 'admin@kingsbrew.com',
        password,
        role: 'ADMIN',
      },
      {
        fullName: 'Manager',
        email: 'manager@kingsbrew.com',
        password,
        role: 'ADMIN',
      },
      {
        fullName: 'John Smith',
        email: 'john@example.com',
        password,
        role: 'CUSTOMER',
      },
      {
        fullName: 'Emma Wilson',
        email: 'emma@example.com',
        password,
        role: 'CUSTOMER',
      },
      {
        fullName: 'David Brown',
        email: 'david@example.com',
        password,
        role: 'CUSTOMER',
      },
      {
        fullName: 'Sophia Miller',
        email: 'sophia@example.com',
        password,
        role: 'CUSTOMER',
      },
      {
        fullName: 'Michael Johnson',
        email: 'michael@example.com',
        password,
        role: 'CUSTOMER',
      },
    ],
    skipDuplicates: true,
  });
}
