export class StatsResponseDto {
  application!: {
    name: string;
    type: string;
  };

  products!: {
    total: number;
    active: number;
    inactive: number;
  };

  categories!: {
    total: number;
  };

  images!: {
    total: number;
  };

  reviews!: {
    total: number;
    averageRating: number;
  };

  orders!: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };

  payments!: {
    total: number;
    success: number;
    failed: number;
  };

  favorites!: {
    total: number;
  };

  latest!: {
    product: Date | null;
    review: Date | null;
    order: Date | null;
  };
}
