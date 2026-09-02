export async function seedPostCategories(prisma: any) {
  const categoriesData = [
    { name: 'Travel', description: 'Posts about travel and adventure' },
    { name: 'Food', description: 'Posts about culinary experiences' },
    { name: 'Technology', description: 'Posts about tech and gadgets' },
    { name: 'Lifestyle', description: 'Posts about daily life' },
  ];

  const categories: any[] = [];
  for (const c of categoriesData) {
    const category = await prisma.postCategory.create({ data: c });
    categories.push(category);
  }

  return categories;
}
