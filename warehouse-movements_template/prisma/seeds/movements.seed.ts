export async function seedMovements(prisma: any, stocks: any[]) {
  const movementsData = [
    { stockIndex: 0, type: 'PURCHASE', quantity: 50, beforeQty: 0, afterQty: 50, remarks: 'Initial stock intake' },
    { stockIndex: 1, type: 'PURCHASE', quantity: 100, beforeQty: 0, afterQty: 100, remarks: 'Initial stock intake' },
    { stockIndex: 2, type: 'ADJUSTMENT', quantity: -5, beforeQty: 25, afterQty: 20, remarks: 'Stock opname correction' },
  ];

  const movements: any[] = [];
  for (const m of movementsData) {
    movements.push(
      await prisma.movement.create({
        data: {
          stockId: stocks[m.stockIndex].id,
          type: m.type,
          quantity: m.quantity,
          beforeQty: m.beforeQty,
          afterQty: m.afterQty,
          remarks: m.remarks,
        },
      }),
    );
  }
  return movements;
}
