export async function seedReviews(prisma: any, users: any[], books: any[]) {
  const members = users.filter((u) => u.role === 'MEMBER');

  const reviewsData = [
    { rating: 5, comment: 'A magical read, couldn\'t put it down!' },
    { rating: 4, comment: 'Great world-building, a bit slow at times.' },
    { rating: 5, comment: 'A classic whodunit, brilliantly plotted.' },
  ];

  const reviews: any[] = [];
  for (let i = 0; i < reviewsData.length; i++) {
    const review = await prisma.review.create({
      data: {
        userId: members[i % members.length].id,
        bookId: books[i % books.length].id,
        rating: reviewsData[i].rating,
        comment: reviewsData[i].comment,
      },
    });
    reviews.push(review);
  }

  return reviews;
}
