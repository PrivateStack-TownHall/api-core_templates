export async function seedSuppliers(prisma: any) {
  const suppliersData = [
    { name: 'PT Sumber Elektronik', contactPerson: 'Budi', phone: '021-1234567', email: 'sales@sumberelektronik.co.id' },
    { name: 'CV Alat Tulis Jaya', contactPerson: 'Sri', phone: '022-7654321', email: 'order@atkjaya.co.id' },
    { name: 'PT Furnitur Nusantara', contactPerson: 'Agus', phone: '024-1122334', email: 'sales@furniturnusantara.co.id' },
  ];

  const suppliers: any[] = [];
  for (const s of suppliersData) {
    suppliers.push(await prisma.supplier.create({ data: s }));
  }
  return suppliers;
}
