import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: any, warehouses: any[]) {
  const password = await bcrypt.hash('123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: { fullName: 'Admin WareTrack', email: 'admin@waretrack.com', password, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: {
        fullName: 'Li Mei',
        email: 'limei@example.com',
        password,
        role: 'MEMBER',
        employeeCode: 'EMP-001',
        warehouseId: warehouses[0]?.id,
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Rina Wijaya',
        email: 'rina@example.com',
        password,
        role: 'MEMBER',
        employeeCode: 'EMP-002',
        warehouseId: warehouses[1]?.id,
      },
    }),
  ]);

  return users;
}
