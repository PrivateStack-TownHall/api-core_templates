export async function seedBrands(prisma: any) {
  const brandsData = ['Logitech', 'Faber-Castell', 'IKEA'];
  const brands: any[] = [];
  for (const name of brandsData) {
    brands.push(await prisma.brand.create({ data: { name } }));
  }
  return brands;
}
