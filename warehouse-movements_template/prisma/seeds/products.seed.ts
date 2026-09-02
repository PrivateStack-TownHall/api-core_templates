export async function seedProducts(prisma: any, categories: any[], brands: any[]) {
  const productsData = [
    { categoryIndex: 0, brandIndex: 0, sku: 'SKU-001', name: 'Wireless Mouse', unit: 'pcs', costPrice: 50000, sellingPrice: 75000, minimumQty: 10 },
    { categoryIndex: 1, brandIndex: 1, sku: 'SKU-002', name: 'Ballpoint Pen (Box of 12)', unit: 'box', costPrice: 15000, sellingPrice: 25000, minimumQty: 20 },
    { categoryIndex: 2, brandIndex: 2, sku: 'SKU-003', name: 'Office Chair', unit: 'pcs', costPrice: 350000, sellingPrice: 500000, minimumQty: 5 },
  ];

  const products: any[] = [];
  for (const p of productsData) {
    products.push(
      await prisma.product.create({
        data: {
          categoryId: categories[p.categoryIndex].id,
          brandId: brands[p.brandIndex].id,
          sku: p.sku,
          name: p.name,
          unit: p.unit,
          costPrice: p.costPrice,
          sellingPrice: p.sellingPrice,
          minimumQty: p.minimumQty,
        },
      }),
    );
  }
  return products;
}
