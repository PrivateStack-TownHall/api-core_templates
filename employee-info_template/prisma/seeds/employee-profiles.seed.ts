export async function seedEmployeeProfiles(prisma: any, users: any[], departments: any[], jobs: any[]) {
  // Semua user (termasuk admin) dikasih EmployeeProfile - HR admin biasanya
  // juga statusnya karyawan. Ini juga yang bikin jumlah record >= 3 walau
  // member cuma 2 (EmployeeProfile 1-1 ke User, unique per userId).
  const phoneNumbers = ['081234567890', '081298765432', '081211112222'];
  const hireDates = ['2024-01-15', '2023-06-01', '2022-11-20'];
  const salaries = [10000000, 8500000, 12000000];

  const profiles: any[] = [];
  for (let i = 0; i < users.length; i++) {
    const profile = await prisma.employeeProfile.create({
      data: {
        userId: users[i].id,
        departmentId: departments[i % departments.length].id,
        jobId: jobs[i % jobs.length].id,
        phoneNumber: phoneNumbers[i % phoneNumbers.length],
        hireDate: new Date(hireDates[i % hireDates.length]),
        salary: salaries[i % salaries.length],
      },
    });
    profiles.push(profile);
  }

  return profiles;
}
