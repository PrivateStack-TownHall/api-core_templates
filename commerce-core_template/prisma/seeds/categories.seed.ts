import { AppType } from '@prisma/client';

export async function seedCategories(prisma: any) {
  await prisma.category.createMany({
    data: [
      {
        appType: AppType.COFFEE,
        name: 'Espresso Based',
      },
      {
        appType: AppType.COFFEE,
        name: 'Milk Based',
      },
      {
        appType: AppType.COFFEE,
        name: 'Cold Coffee',
      },
      {
        appType: AppType.COFFEE,
        name: 'Signature Coffee',
      },
      {
        appType: AppType.COFFEE,
        name: 'Non Coffee',
      },
      {
        appType: AppType.COFFEE,
        name: 'Single Origin',
      },
      {
        appType: AppType.COFFEE,
        name: 'Seasonal Special',
      },
    ],
    skipDuplicates: true,
  });
}
