export async function seedWarehouseLocations(prisma: any, warehouses: any[]) {
  const locationsData = [
    { warehouseIndex: 0, code: 'A-01-01', name: 'Rack A, Row 1, Bin 1', capacity: 100 },
    { warehouseIndex: 0, code: 'A-01-02', name: 'Rack A, Row 1, Bin 2', capacity: 100 },
    { warehouseIndex: 1, code: 'B-01-01', name: 'Rack B, Row 1, Bin 1', capacity: 80 },
  ];

  const locations: any[] = [];
  for (const l of locationsData) {
    locations.push(
      await prisma.warehouseLocation.create({
        data: { warehouseId: warehouses[l.warehouseIndex].id, code: l.code, name: l.name, capacity: l.capacity },
      }),
    );
  }
  return locations;
}
