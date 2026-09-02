export async function seedPurchases(prisma: any, suppliers: any[], products: any[]) {
  // 3 purchase, salah satunya punya 2 item, biar total PurchaseItem juga >= 3
  const purchasesData = [
    {
      supplierIndex: 0,
      invoice: 'INV-2026-001',
      purchaseDate: '2026-01-05',
      items: [{ productIndex: 0, quantity: 50, price: 50000 }],
    },
    {
      supplierIndex: 1,
      invoice: 'INV-2026-002',
      purchaseDate: '2026-01-10',
      items: [
        { productIndex: 1, quantity: 100, price: 15000 },
        { productIndex: 2, quantity: 5, price: 350000 },
      ],
    },
    {
      supplierIndex: 2,
      invoice: 'INV-2026-003',
      purchaseDate: '2026-01-15',
      items: [{ productIndex: 2, quantity: 3, price: 340000 }],
    },
  ];

  const purchases: any[] = [];
  for (const p of purchasesData) {
    const total = p.items.reduce((sum, it) => sum + it.quantity * it.price, 0);

    const purchase = await prisma.purchase.create({
      data: {
        supplierId: suppliers[p.supplierIndex].id,
        invoice: p.invoice,
        purchaseDate: new Date(p.purchaseDate),
        total,
        items: {
          create: p.items.map((it) => ({
            productId: products[it.productIndex].id,
            quantity: it.quantity,
            price: it.price,
          })),
        },
      },
    });
    purchases.push(purchase);
  }

  return purchases;
}
