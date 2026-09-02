import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { HealthModule } from './observability/health/health.module';
import { StatsModule } from './observability/stats/stats.module';

import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { LocationsModule } from './locations/locations.module';
import { DepartmentsModule } from './departments/departments.module';
import { JobsModule } from './jobs/jobs.module';
import { EmployeeProfilesModule } from './employee-profiles/employee-profiles.module';
import { DependentsModule } from './dependents/dependents.module';

@Module({
  imports: [
    PrismaModule,

    UsersModule,
    AuthModule,

    RegionsModule,
    CountriesModule,
    LocationsModule,
    DepartmentsModule,
    JobsModule,
    EmployeeProfilesModule,
    DependentsModule,

    AuditLogsModule,
    HealthModule,
    StatsModule,
  ],
})
export class AppModule {}
