export async function seedReviews(prisma: any) {
  await prisma.review.createMany({
    data: [
      {
        userId: 3,
        productId: 1,
        rating: 5,
        comment: 'Amazing espresso with rich flavor.',
      },

      {
        userId: 4,
        productId: 6,
        rating: 5,
        comment: 'Best cappuccino I have ever tasted.',
      },

      {
        userId: 5,
        productId: 7,
        rating: 4,
        comment: 'Smooth latte with balanced milk and coffee.',
      },

      {
        userId: 6,
        productId: 8,
        rating: 5,
        comment: 'Flat White is absolutely perfect.',
      },

      {
        userId: 7,
        productId: 11,
        rating: 4,
        comment: 'Refreshing cold brew, perfect for summer.',
      },

      {
        userId: 3,
        productId: 16,
        rating: 5,
        comment: 'Kings Brew Signature is my favorite drink.',
      },

      {
        userId: 4,
        productId: 17,
        rating: 4,
        comment: 'Brown Sugar Latte is sweet and delicious.',
      },

      {
        userId: 5,
        productId: 18,
        rating: 5,
        comment: 'Caramel Latte has a wonderful aroma.',
      },

      {
        userId: 6,
        productId: 21,
        rating: 4,
        comment: 'Babycino is great for kids.',
      },

      {
        userId: 7,
        productId: 24,
        rating: 5,
        comment: 'Ethiopia Yirgacheffe has outstanding floral notes.',
      },
    ],
  });

  console.log('✅ 10 reviews seeded');
}
