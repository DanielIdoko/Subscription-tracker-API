import { subscriptionRepository } from "../repositories/SubscriptionRepository";
import { DashboardStats } from "../types/index";

/**
 * Dashboard Service
 * Handles dashboard and analytics logic
 */
export class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Get monthly and yearly spending
    const [monthlySpend, yearlySpend, activeCount, upcomingRenewals, categoryBreakdown] =
      await Promise.all([
        subscriptionRepository.getMonthlySpending(userId),
        subscriptionRepository.getYearlySpending(userId),
        subscriptionRepository.findActiveByUserId(userId).then((subs) => subs.length),
        subscriptionRepository.findUpcomingRenewals(userId, 30),
        subscriptionRepository.getCategoryBreakdown(userId),
      ]);

    return {
      totalMonthlySpend: parseFloat(monthlySpend.toFixed(2)),
      totalYearlySpend: parseFloat(yearlySpend.toFixed(2)),
      activeSubscriptionsCount: activeCount,
      upcomingRenewals: upcomingRenewals
        .slice(0, 5) // Limit to top 5
        .map((sub) => ({
          id: (sub as any)._id?.toString() || "",
          name: sub.name,
          nextBillingDate: sub.nextBillingDate,
          price: sub.price,
        })),
      categoryBreakdown: categoryBreakdown.map((cat: any) => ({
        category: cat._id,
        count: cat.count,
        totalSpend: parseFloat(cat.totalSpend.toFixed(2)),
      })),
    };
  }

  /**
   * Get spending analytics
   */
  async getSpendingAnalytics(userId: string): Promise<{
    monthly: number;
    yearly: number;
    daily: number;
    currency: string;
  }> {
    const [monthlySpend, yearlySpend] = await Promise.all([
      subscriptionRepository.getMonthlySpending(userId),
      subscriptionRepository.getYearlySpending(userId),
    ]);

    return {
      monthly: parseFloat(monthlySpend.toFixed(2)),
      yearly: parseFloat(yearlySpend.toFixed(2)),
      daily: parseFloat((monthlySpend / 30).toFixed(2)),
      currency: "USD",
    };
  }

  /**
   * Get category analytics
   */
  async getCategoryAnalytics(userId: string): Promise<
    Array<{
      category: string;
      count: number;
      totalSpend: number;
      averagePrice: number;
    }>
  > {
    const breakdown = await subscriptionRepository.getCategoryBreakdown(userId);

    return breakdown.map((cat: any) => ({
      category: cat._id,
      count: cat.count,
      totalSpend: parseFloat(cat.totalSpend.toFixed(2)),
      averagePrice: parseFloat(cat.avgPrice.toFixed(2)),
    }));
  }
}

export const dashboardService = new DashboardService();
