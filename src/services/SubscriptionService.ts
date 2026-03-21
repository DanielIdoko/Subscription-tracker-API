import { subscriptionRepository } from "../repositories/SubscriptionRepository";
import { NotFoundError, AuthorizationError } from "../errors/AppError";
import { ISubscription, QueryOptions } from "../types/index";
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../dtos/subscription.dto";
import { notificationService } from "./NotificationService";
import mongoose from "mongoose";

/**
 * Subscription Service
 * Handles all subscription business logic
 */
export class SubscriptionService {
  /**
   * Create a new subscription for a user
   */
  async createSubscription(
    userId: string,
    input: CreateSubscriptionInput,
  ): Promise<ISubscription> {
    // Calculate next billing date if not provided
    const nextBillingDate = input.nextBillingDate || new Date(Date.now() + (input.billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);

    // Add userId to subscription data
    const subscriptionData: Partial<ISubscription> = {
      ...input,
      userId,
      nextBillingDate,
    };

    // Create subscription
    const subscription = await subscriptionRepository.create(subscriptionData);

    // Send notification
    await notificationService.sendSubscriptionCreated(
      userId,
      subscription.name,
      subscription.price,
    );

    console.log(
      `[Subscription] Created subscription for user ${userId}: ${subscription.name}`,
    );

    return subscription;
  }

  /**
   * Get single subscription by ID
   */
  async getSubscription(subscriptionId: string, userId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.userId.toString() !== userId) {
      throw new AuthorizationError("Cannot access this subscription");
    }

    return subscription;
  }

  /**
   * Get all subscriptions for a user
   */
  async getUserSubscriptions(
    userId: string,
    options?: QueryOptions,
  ): Promise<{ subscriptions: ISubscription[]; total: number }> {
    return subscriptionRepository.findByUserId(userId, options);
  }

  /**
   * Get active subscriptions for a user
   */
  async getActiveSubscriptions(userId: string): Promise<ISubscription[]> {
    return subscriptionRepository.findActiveByUserId(userId);
  }

  /**
   * Get upcoming renewals
   */
  async getUpcomingRenewals(userId: string, daysAhead?: number): Promise<ISubscription[]> {
    return subscriptionRepository.findUpcomingRenewals(userId, daysAhead);
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    subscriptionId: string,
    userId: string,
    input: UpdateSubscriptionInput,
  ): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.userId.toString() !== userId) {
      throw new AuthorizationError("Cannot update this subscription");
    }

    // Update subscription
    const updated = await subscriptionRepository.update(subscriptionId, input);

    console.log(
      `[Subscription] Updated subscription for user ${userId}: ${updated.name}`,
    );

    return updated;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, userId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.userId.toString() !== userId) {
      throw new AuthorizationError("Cannot cancel this subscription");
    }

    // Update subscription status
    const updated = await subscriptionRepository.update(subscriptionId, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    // Send notification
    await notificationService.sendSubscriptionCancelled(userId, updated.name);

    console.log(
      `[Subscription] Cancelled subscription for user ${userId}: ${updated.name}`,
    );

    return updated;
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(subscriptionId: string, userId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.userId.toString() !== userId) {
      throw new AuthorizationError("Cannot pause this subscription");
    }

    // Update subscription status
    const updated = await subscriptionRepository.update(subscriptionId, {
      status: "paused",
    });

    console.log(`[Subscription] Paused subscription for user ${userId}: ${updated.name}`);

    return updated;
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(subscriptionId: string, userId: string): Promise<ISubscription> {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.userId.toString() !== userId) {
      throw new AuthorizationError("Cannot resume this subscription");
    }

    // Update subscription status
    const updated = await subscriptionRepository.update(subscriptionId, {
      status: "active",
    });

    console.log(
      `[Subscription] Resumed subscription for user ${userId}: ${updated.name}`,
    );

    return updated;
  }

  /**
   * Delete subscription
   */
  async deleteSubscription(subscriptionId: string, userId: string): Promise<void> {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    // Check if subscription belongs to user
    if (subscription.userId.toString() !== userId) {
      throw new AuthorizationError("Cannot delete this subscription");
    }

    await subscriptionRepository.delete(subscriptionId);

    console.log(
      `[Subscription] Deleted subscription for user ${userId}: ${subscription.name}`,
    );
  }

  /**
   * Check if subscription belongs to user
   */
  async verifyOwnership(subscriptionId: string, userId: string): Promise<boolean> {
    return subscriptionRepository.existsForUser(subscriptionId, userId);
  }
}

export const subscriptionService = new SubscriptionService();
