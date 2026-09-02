import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsResponseDto } from './dto/stats-response.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponseDto> {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalBrands,
      totalWarehouses,
      totalStocks,
      stockQtyAgg,
      totalSuppliers,
      activeSuppliers,
      totalPurchases,
      pendingPurchases,
      completedPurchases,
      cancelledPurchases,
      totalTransfers,
      pendingTransfers,
      completedTransfers,
      cancelledTransfers,
      latestProduct,
      latestPurchase,
      latestTransfer,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.productCategory.count(),
      this.prisma.brand.count(),
      this.prisma.warehouse.count(),
      this.prisma.stock.count(),
      this.prisma.stock.aggregate({ _sum: { quantity: true } }),
      this.prisma.supplier.count(),
      this.prisma.supplier.count({ where: { isActive: true } }),
      this.prisma.purchase.count(),
      this.prisma.purchase.count({ where: { status: 'PENDING' } }),
      this.prisma.purchase.count({ where: { status: 'COMPLETED' } }),
      this.prisma.purchase.count({ where: { status: 'CANCELLED' } }),
      this.prisma.transfer.count(),
      this.prisma.transfer.count({ where: { status: 'PENDING' } }),
      this.prisma.transfer.count({ where: { status: 'COMPLETED' } }),
      this.prisma.transfer.count({ where: { status: 'CANCELLED' } }),
      this.prisma.product.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.purchase.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
      this.prisma.transfer.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ]);

    return {
      application: { name: 'WareTrack', type: 'INVENTORY' },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: totalProducts - activeProducts,
      },
      categories: { total: totalCategories },
      brands: { total: totalBrands },
      warehouses: { total: totalWarehouses },
      stocks: {
        total: totalStocks,
        totalQuantity: stockQtyAgg._sum.quantity ?? 0,
      },
      suppliers: { total: totalSuppliers, active: activeSuppliers },
      purchases: {
        total: totalPurchases,
        pending: pendingPurchases,
        completed: completedPurchases,
        cancelled: cancelledPurchases,
      },
      transfers: {
        total: totalTransfers,
        pending: pendingTransfers,
        completed: completedTransfers,
        cancelled: cancelledTransfers,
      },
      latest: {
        product: latestProduct?.createdAt ?? null,
        purchase: latestPurchase?.createdAt ?? null,
        transfer: latestTransfer?.createdAt ?? null,
      },
    };
  }
}
