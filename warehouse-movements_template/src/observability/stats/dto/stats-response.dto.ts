export class StatsResponseDto {
  application!: { name: string; type: string };
  products!: { total: number; active: number; inactive: number };
  categories!: { total: number };
  brands!: { total: number };
  warehouses!: { total: number };
  stocks!: { total: number; totalQuantity: number };
  suppliers!: { total: number; active: number };
  purchases!: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  transfers!: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  latest!: {
    product: Date | null;
    purchase: Date | null;
    transfer: Date | null;
  };
}
