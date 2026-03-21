import { Subscription } from "../models/Subscription.ts";
import { ISubscription, QueryOptions } from "../types/index.ts";
import { NotFoundError } from "../errors/AppError.ts";
import mongoose from "mongoose";

/**
 * Subscription Repository
 * Handles all subscription database operations
 */
export class SubscriptionRepository {
  /**
   * Create a new subscription
   */
  async create(subscriptionData: Partial<ISubscription>): Promise<ISubscription> {
    const subscription = await Subscription.create(subscriptionData);
    return subscription.toObject();
  }

  /**
   * Find subscription by ID
   */
  async findById(id: string): Promise<ISubscription> {
    const subscription = await Subscription.findById(id).lean();
    if (!subscription) {
      throw new NotFoundError("Subscription");
    }
    return subscription;
  }

  /**
   * Find subscriptions by user ID
   */
  async findByUserId(
    userId: string,
    options: QueryOptions = {},
  ): Promise<{ subscriptions: ISubscription[]; total: number }> {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = -1, filter = {} } =
      options;

    const skip = (page - 1) * limit;

    const query: any = { userId, ...filter };

    const [subscriptions, total] = await Promise.all([
      Subscription.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscription.countDocuments(query),
    ]);

    return { subscriptions, total };
  }

  /**
   * Find all active subscriptions by user ID
   */
  async findActiveByUserId(userId: string): Promise<ISubscription[]> {
    const subscriptions = await Subscription.find({
      userId,
      status: "active",
    }).lean();
    return subscriptions;
  }

  /**
   * Update subscription
   */
  async update(id: string, updateData: Partial<ISubscription>): Promise<ISubscription> {
    const subscription = await Subscription.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!subscription) {
      throw new NotFoundError("Subscription");
    }

    return subscription;
  }

  /**
   * Delete subscription
   */
  async delete(id: string): Promise<void> {
    const result = await Subscription.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError("Subscription");
    }
  }

  /**
   * Check if subscription exists and belongs to user
   */
  async existsForUser(subscriptionId: string, userId: string): Promise<boolean> {
    const count = await Subscription.countDocuments({
      _id: subscriptionId,
      userId,
    });
    return count > 0;
  }

  /**
   * Get subscription to update next billing date
   * Used for cron jobs
   */
  async getSubscriptionsToRenew(): Promise<ISubscription[]> {
    const now = new Date();
    const subscriptions = await Subscription.find({
      status: "active",
      autoRenew: true,
      nextBillingDate: { $lte: now },
    }).lean();
    return subscriptions;
  }

  /**
   * Bulk update next billing date
   */
  async updateNextBillingDate(subscriptionId: string): Promise<void> {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new NotFoundError("Subscription");
    }

    // Calculate next billing date based on cycle
    const nextDate = new Date(subscription.nextBillingDate!);

    if (subscription.billingCycle === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (subscription.billingCycle === "yearly") {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    subscription.nextBillingDate = nextDate;
    await subscription.save();
  }

  /**
   * Get subscription statistics for dashboard
   */
  async getStats(userId: string): Promise<any> {
    const stats = await Subscription.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalSpend: { $sum: "$price" },
        },
      },
    ]);

    return stats;
  }

  /**
   * Get category breakdown
   */
  async getCategoryBreakdown(userId: string): Promise<any> {
    const breakdown = await Subscription.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalSpend: { $sum: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { totalSpend: -1 } },
    ]);

    return breakdown;
  }

  /**
   * Find upcoming renewals for a user
   */
  async findUpcomingRenewals(userId: string, daysAhead: number = 7): Promise<ISubscription[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    const subscriptions = await Subscription.find({
      userId,
      status: "active",
      autoRenew: true,
      nextBillingDate: { $gte: now, $lte: futureDate },
    }).lean();

    return subscriptions;
  }

  /**
   * Find all upcoming renewals across all users
   */
  async findAllUpcomingRenewals(daysAhead: number = 7): Promise<ISubscription[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    const subscriptions = await Subscription.find({
      status: "active",
      autoRenew: true,
      nextBillingDate: { $gte: now, $lte: futureDate },
    }).lean();

    return subscriptions;
  }

  /**
   * Get monthly spending
   */
  async getMonthlySpending(userId: string): Promise<number> {
    const results = await Subscription.aggregate([
      {
        $match: {
          userId,
          status: "active",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [
                { $eq: ["$billingCycle", "monthly"] },
                "$price",
                { $divide: ["$price", 12] },
              ],
            },
          },
        },
      },
    ]);

    return results[0]?.total || 0;
  }

  /**
   * Get yearly spending
   */
  async getYearlySpending(userId: string): Promise<number> {
    const results = await Subscription.aggregate([
      {
        $match: {
          userId: require("mongoose").Types.ObjectId.createFromHexString(userId),
          status: "active",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [
                { $eq: ["$billingCycle", "yearly"] },
                "$price",
                { $multiply: ["$price", 12] },
              ],
            },
          },
        },
      },
    ]);

    return results[0]?.total || 0;
  }
}

export const subscriptionRepository = new SubscriptionRepository();
