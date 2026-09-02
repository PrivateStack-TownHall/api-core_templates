export async function seedProductCategories(prisma: any) {
  const categoriesData = [
    { code: 'ELEC', name: 'Electronics', description: 'Electronic devices and accessories' },
    { code: 'STAT', name: 'Stationery', description: 'Office and stationery supplies' },
    { code: 'FURN', name: 'Furniture', description: 'Office furniture' },
  ];

  const categories: any[] = [];
  for (const c of categoriesData) {
    categories.push(await prisma.productCategory.create({ data: c }));
  }
  return categories;
}
