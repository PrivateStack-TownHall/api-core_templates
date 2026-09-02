export async function seedPublishers(prisma: any) {
  const publishersData = [
    { name: 'Bloomsbury', website: 'https://bloomsbury.com' },
    { name: 'Bantam Books', website: 'https://bantambooks.com' },
    { name: 'HarperCollins', website: 'https://harpercollins.com' },
  ];

  const publishers: any[] = [];
  for (const p of publishersData) {
    publishers.push(await prisma.publisher.create({ data: p }));
  }
  return publishers;
}
