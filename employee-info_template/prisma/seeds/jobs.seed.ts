export async function seedJobs(prisma: any) {
  const jobsData = [
    { title: 'Software Engineer', minSalary: 8000000, maxSalary: 20000000 },
    { title: 'HR Specialist', minSalary: 6000000, maxSalary: 15000000 },
    { title: 'Sales Executive', minSalary: 5000000, maxSalary: 18000000 },
  ];

  const jobs: any[] = [];
  for (const j of jobsData) {
    jobs.push(await prisma.job.create({ data: j }));
  }
  return jobs;
}
