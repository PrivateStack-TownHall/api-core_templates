import { AppType } from '@prisma/client';

export async function seedCoffees(prisma: any) {
  await prisma.product.createMany({
    data: [
      // Espresso Based (Category 1)

      {
        categoryId: 1,
        appType: AppType.COFFEE,
        name: 'Espresso',
        description: 'Strong espresso shot',
        price: 25000,
        stock: 120,
      },
      {
        categoryId: 1,
        appType: AppType.COFFEE,
        name: 'Double Espresso',
        description: 'Double shot espresso',
        price: 32000,
        stock: 100,
      },
      {
        categoryId: 1,
        appType: AppType.COFFEE,
        name: 'Americano',
        description: 'Espresso with hot water',
        price: 28000,
        stock: 110,
      },
      {
        categoryId: 1,
        appType: AppType.COFFEE,
        name: 'Long Black',
        description: 'Australian style black coffee',
        price: 30000,
        stock: 90,
      },
      {
        categoryId: 1,
        appType: AppType.COFFEE,
        name: 'Ristretto',
        description: 'Short concentrated espresso',
        price: 27000,
        stock: 80,
      },

      // Milk Based (Category 2)

      {
        categoryId: 2,
        appType: AppType.COFFEE,
        name: 'Cappuccino',
        description: 'Classic cappuccino',
        price: 38000,
        stock: 100,
      },
      {
        categoryId: 2,
        appType: AppType.COFFEE,
        name: 'Cafe Latte',
        description: 'Smooth milk coffee',
        price: 40000,
        stock: 95,
      },
      {
        categoryId: 2,
        appType: AppType.COFFEE,
        name: 'Flat White',
        description: 'Australian favorite',
        price: 42000,
        stock: 85,
      },
      {
        categoryId: 2,
        appType: AppType.COFFEE,
        name: 'Piccolo Latte',
        description: 'Small latte with rich flavor',
        price: 39000,
        stock: 70,
      },
      {
        categoryId: 2,
        appType: AppType.COFFEE,
        name: 'Macchiato',
        description: 'Espresso with milk foam',
        price: 35000,
        stock: 80,
      },

      // Cold Coffee (Category 3)

      {
        categoryId: 3,
        appType: AppType.COFFEE,
        name: 'Cold Brew',
        description: 'Slow brewed cold coffee',
        price: 45000,
        stock: 70,
      },
      {
        categoryId: 3,
        appType: AppType.COFFEE,
        name: 'Vanilla Cold Brew',
        description: 'Cold brew with vanilla',
        price: 47000,
        stock: 65,
      },
      {
        categoryId: 3,
        appType: AppType.COFFEE,
        name: 'Coconut Cold Brew',
        description: 'Cold brew with coconut milk',
        price: 48000,
        stock: 60,
      },
      {
        categoryId: 3,
        appType: AppType.COFFEE,
        name: 'Iced Latte',
        description: 'Refreshing iced latte',
        price: 38000,
        stock: 90,
      },
      {
        categoryId: 3,
        appType: AppType.COFFEE,
        name: 'Iced Mocha',
        description: 'Chocolate iced coffee',
        price: 50000,
        stock: 55,
      },

      // Signature Coffee (Category 4)

      {
        categoryId: 4,
        appType: AppType.COFFEE,
        name: 'Kings Brew Signature',
        description: 'House signature blend',
        price: 55000,
        stock: 50,
      },
      {
        categoryId: 4,
        appType: AppType.COFFEE,
        name: 'Brown Sugar Latte',
        description: 'Latte with brown sugar',
        price: 45000,
        stock: 75,
      },
      {
        categoryId: 4,
        appType: AppType.COFFEE,
        name: 'Caramel Latte',
        description: 'Creamy caramel latte',
        price: 46000,
        stock: 70,
      },
      {
        categoryId: 4,
        appType: AppType.COFFEE,
        name: 'Hazelnut Cappuccino',
        description: 'Hazelnut flavored cappuccino',
        price: 44000,
        stock: 80,
      },
      {
        categoryId: 4,
        appType: AppType.COFFEE,
        name: 'Salted Caramel Coffee',
        description: 'Sweet and salty coffee',
        price: 52000,
        stock: 60,
      },

      // Non Coffee (Category 5)

      {
        categoryId: 5,
        appType: AppType.COFFEE,
        name: 'Babycino',
        description: 'Steamed milk for kids',
        price: 18000,
        stock: 120,
      },
      {
        categoryId: 5,
        appType: AppType.COFFEE,
        name: 'Matcha Latte',
        description: 'Premium Japanese matcha',
        price: 45000,
        stock: 80,
      },
      {
        categoryId: 5,
        appType: AppType.COFFEE,
        name: 'Chocolate Latte',
        description: 'Rich chocolate drink',
        price: 40000,
        stock: 90,
      },

      // Single Origin (Category 6)

      {
        categoryId: 6,
        appType: AppType.COFFEE,
        name: 'Ethiopia Yirgacheffe',
        description: 'Floral single origin coffee',
        price: 60000,
        stock: 40,
      },
      {
        categoryId: 6,
        appType: AppType.COFFEE,
        name: 'Colombia Supremo',
        description: 'Balanced Colombian coffee',
        price: 58000,
        stock: 45,
      },

      // Seasonal Special (Category 7)

      {
        categoryId: 7,
        appType: AppType.COFFEE,
        name: 'Christmas Spice Latte',
        description: 'Festive holiday latte',
        price: 55000,
        stock: 30,
      },
      {
        categoryId: 7,
        appType: AppType.COFFEE,
        name: 'Summer Coconut Brew',
        description: 'Refreshing summer coffee',
        price: 53000,
        stock: 35,
      },
      {
        categoryId: 7,
        appType: AppType.COFFEE,
        name: 'Pumpkin Spice Latte',
        description: 'Seasonal pumpkin latte',
        price: 57000,
        stock: 25,
      },
      {
        categoryId: 7,
        appType: AppType.COFFEE,
        name: 'Winter Mocha',
        description: 'Warm chocolate mocha',
        price: 54000,
        stock: 30,
      },
    ],
  });

  console.log('✅ 27 coffees seeded');
}
