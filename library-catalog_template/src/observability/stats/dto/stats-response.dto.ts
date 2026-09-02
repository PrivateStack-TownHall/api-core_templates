export class StatsResponseDto {
  application!: { name: string; type: string };
  books!: { total: number; totalCopies: number };
  authors!: { total: number };
  publishers!: { total: number };
  genres!: { total: number };
  reviews!: { total: number; averageRating: number };
  users!: { total: number; admins: number; members: number };
  latest!: { book: Date | null; review: Date | null };
}
