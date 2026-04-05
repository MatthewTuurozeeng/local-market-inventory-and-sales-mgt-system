import { getPublicStatsSummary } from "../models/database.ts";

interface PublicStats {
  totalVendors: number;
  totalSales: number;
  totalUnits: number;
  totalTransactions: number;
  todayRevenue: number;
  topVendorRevenueToday: number;
  snapshotDayLabel: string;
}

const getPublicStats = async (): Promise<PublicStats> => {
  const summary = await getPublicStatsSummary();
  const todayRevenue = summary.todayRevenue;
  const topVendorRevenueToday = summary.topVendorRevenueToday;
  const snapshotDayLabel = new Date().toLocaleDateString("en-GH", {
    weekday: "short",
  });

  return {
    totalVendors: summary.totalVendors,
    totalSales: summary.totalSales,
    totalUnits: summary.totalUnits,
    totalTransactions: summary.totalTransactions,
    todayRevenue,
    topVendorRevenueToday,
    snapshotDayLabel,
  };
};

export { getPublicStats, type PublicStats };
