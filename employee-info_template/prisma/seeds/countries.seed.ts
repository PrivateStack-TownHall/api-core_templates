export async function seedCountries(prisma: any, regions: any[]) {
  const countriesData = [
    { name: 'Indonesia', regionIndex: 0 },
    { name: 'Singapore', regionIndex: 0 },
    { name: 'Japan', regionIndex: 1 },
  ];

  const countries: any[] = [];
  for (const c of countriesData) {
    countries.push(await prisma.country.create({ data: { name: c.name, regionId: regions[c.regionIndex].id } }));
  }
  return countries;
}
