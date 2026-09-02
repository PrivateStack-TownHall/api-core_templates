export async function seedGenres(prisma: any) {
  const genresData = ['Fantasy', 'Mystery', 'Sci-Fi'];
  const genres: any[] = [];
  for (const name of genresData) {
    genres.push(await prisma.genre.create({ data: { name } }));
  }
  return genres;
}
