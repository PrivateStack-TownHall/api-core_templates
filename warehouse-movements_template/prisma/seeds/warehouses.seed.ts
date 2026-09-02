export async function seedWarehouses(prisma: any) {
  const warehousesData = [
    { code: 'WH-JKT-01', name: 'Jakarta Main Warehouse', address: 'Jl. Industri No. 1', capacity: 5000 },
    { code: 'WH-SBY-01', name: 'Surabaya Warehouse', address: 'Jl. Rungkut Industri No. 10', capacity: 3000 },
    { code: 'WH-BDG-01', name: 'Bandung Warehouse', address: 'Jl. Soekarno Hatta No. 25', capacity: 2000 },
  ];

  const warehouses: any[] = [];
  for (const w of warehousesData) {
    warehouses.push(await prisma.warehouse.create({ data: w }));
  }
  return warehouses;
}
