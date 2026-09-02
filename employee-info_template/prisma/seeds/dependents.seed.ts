export async function seedDependents(prisma: any, employeeProfiles: any[]) {
  const dependentsData = [
    { firstName: 'Rina', lastName: 'Wijaya', relationship: 'Spouse' },
    { firstName: 'Budi', lastName: 'Wijaya', relationship: 'Child' },
    { firstName: 'Sari', lastName: 'Dewi', relationship: 'Spouse' },
  ];

  const dependents: any[] = [];
  for (let i = 0; i < dependentsData.length; i++) {
    const profile = employeeProfiles[i % employeeProfiles.length];
    const dependent = await prisma.dependent.create({
      data: { employeeId: profile.id, ...dependentsData[i] },
    });
    dependents.push(dependent);
  }

  return dependents;
}
