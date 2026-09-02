export async function seedStocks(prisma: any, warehouses: any[], locations: any[], products: any[]) {
  const stocksData = [
    { warehouseIndex: 0, locationIndex: 0, productIndex: 0, quantity: 50 },
    { warehouseIndex: 0, locationIndex: 1, productIndex: 1, quantity: 100 },
    { warehouseIndex: 1, locationIndex: 2, productIndex: 2, quantity: 20 },
  ];

  const stocks: any[] = [];
  for (const s of stocksData) {
    stocks.push(
      await prisma.stock.create({
        data: {
          warehouseId: warehouses[s.warehouseIndex].id,
          locationId: locations[s.locationIndex].id,
          productId: products[s.productIndex].id,
          quantity: s.quantity,
        },
      }),
    );
  }
  return stocks;
}
