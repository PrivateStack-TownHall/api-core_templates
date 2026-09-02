export async function seedTransfers(prisma: any, warehouses: any[], products: any[]) {
  const transfersData = [
    {
      code: 'TRF-2026-001',
      fromIndex: 0,
      toIndex: 1,
      items: [{ productIndex: 0, quantity: 10 }],
    },
    {
      code: 'TRF-2026-002',
      fromIndex: 0,
      toIndex: 2,
      items: [
        { productIndex: 1, quantity: 20 },
        { productIndex: 2, quantity: 2 },
      ],
    },
    {
      code: 'TRF-2026-003',
      fromIndex: 1,
      toIndex: 2,
      items: [{ productIndex: 2, quantity: 1 }],
    },
  ];

  const transfers: any[] = [];
  for (const t of transfersData) {
    const transfer = await prisma.transfer.create({
      data: {
        code: t.code,
        fromWarehouseId: warehouses[t.fromIndex].id,
        toWarehouseId: warehouses[t.toIndex].id,
        items: {
          create: t.items.map((it) => ({ productId: products[it.productIndex].id, quantity: it.quantity })),
        },
      },
    });
    transfers.push(transfer);
  }

  return transfers;
}
