export async function seedAuthors(prisma: any) {
  const authorsData = [
    { name: 'J.K. Rowling', bio: 'British author, best known for Harry Potter.' },
    { name: 'George R.R. Martin', bio: 'American novelist, author of A Song of Ice and Fire.' },
    { name: 'Agatha Christie', bio: 'English writer, best known for detective novels.' },
  ];

  const authors: any[] = [];
  for (const a of authorsData) {
    authors.push(await prisma.author.create({ data: a }));
  }
  return authors;
}
