export async function seedDepartments(prisma: any, locations: any[]) {
  const departmentsData = [
    { name: 'Engineering', locationIndex: 0 },
    { name: 'Human Resources', locationIndex: 0 },
    { name: 'Sales', locationIndex: 1 },
  ];

  const departments: any[] = [];
  for (const d of departmentsData) {
    departments.push(
      await prisma.department.create({ data: { name: d.name, locationId: locations[d.locationIndex].id } }),
    );
  }
  return departments;
}
