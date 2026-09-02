import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedRegions } from './seeds/regions.seed';
import { seedCountries } from './seeds/countries.seed';
import { seedLocations } from './seeds/locations.seed';
import { seedDepartments } from './seeds/departments.seed';
import { seedJobs } from './seeds/jobs.seed';
import { seedEmployeeProfiles } from './seeds/employee-profiles.seed';
import { seedDependents } from './seeds/dependents.seed';
import { seedAuditLogs } from './seeds/audit-logs.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('👨‍💼 Start Seeding M-ployee...');

  const users = await seedUsers(prisma);
  console.log(`  ✓ ${users.length} users`);

  const regions = await seedRegions(prisma);
  console.log(`  ✓ ${regions.length} regions`);

  const countries = await seedCountries(prisma, regions);
  console.log(`  ✓ ${countries.length} countries`);

  const locations = await seedLocations(prisma, countries);
  console.log(`  ✓ ${locations.length} locations`);

  const departments = await seedDepartments(prisma, locations);
  console.log(`  ✓ ${departments.length} departments`);

  const jobs = await seedJobs(prisma);
  console.log(`  ✓ ${jobs.length} jobs`);

  const employeeProfiles = await seedEmployeeProfiles(prisma, users, departments, jobs);
  console.log(`  ✓ ${employeeProfiles.length} employee profiles`);

  const dependents = await seedDependents(prisma, employeeProfiles);
  console.log(`  ✓ ${dependents.length} dependents`);

  const auditLogs = await seedAuditLogs(prisma, users, employeeProfiles);
  console.log(`  ✓ ${auditLogs.length} audit logs`);

  console.log('✅ Seeding Completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
