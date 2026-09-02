export async function seedBooks(prisma: any, authors: any[], publishers: any[], genres: any[]) {
  const booksData = [
    {
      title: "Harry Potter and the Philosopher's Stone",
      isbn: '9780747532699',
      publisherIndex: 0,
      publishedYear: 1997,
      description: 'A young wizard discovers his magical heritage on his 11th birthday.',
      totalCopies: 3,
      authorIndexes: [0],
      genreIndexes: [0],
    },
    {
      title: 'A Game of Thrones',
      isbn: '9780553103540',
      publisherIndex: 1,
      publishedYear: 1996,
      description: 'Noble families vie for control of the Iron Throne.',
      totalCopies: 2,
      authorIndexes: [1],
      genreIndexes: [0],
    },
    {
      title: 'Murder on the Orient Express',
      isbn: '9780007119318',
      publisherIndex: 2,
      publishedYear: 1934,
      description: 'Detective Hercule Poirot investigates a murder aboard a train.',
      totalCopies: 4,
      authorIndexes: [2],
      genreIndexes: [1],
    },
  ];

  const books: any[] = [];
  for (const b of booksData) {
    const book = await prisma.book.create({
      data: {
        title: b.title,
        isbn: b.isbn,
        publisherId: publishers[b.publisherIndex].id,
        publishedYear: b.publishedYear,
        description: b.description,
        totalCopies: b.totalCopies,
        authors: { create: b.authorIndexes.map((i) => ({ authorId: authors[i].id })) },
        genres: { create: b.genreIndexes.map((i) => ({ genreId: genres[i].id })) },
      },
    });
    books.push(book);
  }

  return books;
}
