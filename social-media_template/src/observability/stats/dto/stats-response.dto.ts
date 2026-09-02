export class StatsResponseDto {
  application!: { name: string; type: string };
  posts!: { total: number };
  categories!: { total: number };
  comments!: { total: number };
  likes!: { total: number };
  users!: { total: number; admins: number; members: number };
  notifications!: { total: number; unread: number };
  latest!: { post: Date | null; comment: Date | null };
}
