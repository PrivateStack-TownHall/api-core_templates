export async function seedRegions(prisma: any) {
  const regionsData = ['Southeast Asia', 'East Asia', 'Europe'];
  const regions: any[] = [];
  for (const name of regionsData) {
    regions.push(await prisma.region.create({ data: { name } }));
  }
  return regions;
}
