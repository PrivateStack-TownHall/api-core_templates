export class StatsResponseDto {
  application!: { name: string; type: string };
  threads!: { total: number };
  comments!: { total: number };
  likes!: { total: number };
  stars!: { total: number };
  users!: { total: number; admins: number; members: number };
  notifications!: { total: number; unread: number };
  latest!: { thread: Date | null; comment: Date | null };
}
