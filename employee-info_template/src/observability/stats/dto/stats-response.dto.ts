export class StatsResponseDto {
  application!: { name: string; type: string };
  employees!: { total: number };
  departments!: { total: number };
  jobs!: { total: number };
  regions!: { total: number };
  countries!: { total: number };
  locations!: { total: number };
  dependents!: { total: number };
  latest!: { employeeProfile: Date | null };
}
