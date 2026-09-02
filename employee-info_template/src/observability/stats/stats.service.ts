import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsResponseDto } from './dto/stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponseDto> {
    const [
      totalEmployees,
      totalDepartments,
      totalJobs,
      totalRegions,
      totalCountries,
      totalLocations,
      totalDependents,
      latestEmployee,
    ] = await Promise.all([
      this.prisma.employeeProfile.count(),
      this.prisma.department.count(),
      this.prisma.job.count(),
      this.prisma.region.count(),
      this.prisma.country.count(),
      this.prisma.location.count(),
      this.prisma.dependent.count(),
      this.prisma.employeeProfile.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      application: { name: 'M-ployee', type: 'HR' },
      employees: { total: totalEmployees },
      departments: { total: totalDepartments },
      jobs: { total: totalJobs },
      regions: { total: totalRegions },
      countries: { total: totalCountries },
      locations: { total: totalLocations },
      dependents: { total: totalDependents },
      latest: { employeeProfile: latestEmployee?.createdAt ?? null },
    };
  }
}
