export async function seedLocations(prisma: any, countries: any[]) {
  const locationsData = [
    { countryIndex: 0, city: 'Jakarta', streetAddress: 'Jl. Sudirman No. 1', postalCode: '10220', stateProvince: 'DKI Jakarta' },
    { countryIndex: 0, city: 'Surabaya', streetAddress: 'Jl. Basuki Rahmat No. 5', postalCode: '60271', stateProvince: 'East Java' },
    { countryIndex: 1, city: 'Singapore', streetAddress: '1 Raffles Place', postalCode: '048616', stateProvince: null },
  ];

  const locations: any[] = [];
  for (const l of locationsData) {
    locations.push(
      await prisma.location.create({
        data: {
          countryId: countries[l.countryIndex].id,
          city: l.city,
          streetAddress: l.streetAddress,
          postalCode: l.postalCode,
          stateProvince: l.stateProvince,
        },
      }),
    );
  }
  return locations;
}
