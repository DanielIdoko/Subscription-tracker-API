import cron from "node-cron";
import { subscriptionRepository } from "../repositories/SubscriptionRepository.ts";
import { CRON_TIMING } from "../constants/index.ts";

/**
 * Cron Job: Check for upcoming subscription renewals
 * Runs daily at midnight (0 0 * * *)
 */
export const setupRenewalCheckJob = (): void => {
  cron.schedule(CRON_TIMING.CHECK_RENEWALS, async () => {
    console.log("[Cron] Running renewal check job...");

    try {
      // Get subscriptions to renew
      const subscriptions = await subscriptionRepository.getSubscriptionsToRenew();

      if (subscriptions.length === 0) {
        console.log("[Cron] No subscriptions to renew");
        return;
      }

      console.log(`[Cron] Found ${subscriptions.length} subscriptions to renew`);

      // Process renewals
      for (const subscription of subscriptions) {
        try {
          await subscriptionRepository.updateNextBillingDate((subscription as any)._id!.toString());
          console.log(
            `[Cron] Updated renewal for subscription: ${subscription.name}`,
          );
        } catch (error) {
          console.error(
            `[Cron] Error updating renewal for subscription ${(subscription as any)._id}:`,
            error,
          );
        }
      }

      console.log("[Cron] Renewal check job completed");
    } catch (error) {
      console.error("[Cron] Error in renewal check job:", error);
    }
  });
};

/**
 * Cron Job: Send renewal notifications
 * Runs daily at noon (0 12 * * *)
 */
export const setupNotificationJob = (): void => {
  cron.schedule(CRON_TIMING.SEND_NOTIFICATIONS, async () => {
    console.log("[Cron] Running notification job...");

    try {
      // Import notification service dynamically to avoid circular dependencies
      const { notificationService } = await import("../services/NotificationService.ts");

      await notificationService.sendBatchRenewalNotifications();

      console.log("[Cron] Notification job completed");
    } catch (error) {
      console.error("[Cron] Error in notification job:", error);
    }
  });
};

/**
 * Setup all cron jobs
 */
export const setupAllCronJobs = (): void => {
  console.log("[Cron] Setting up scheduled jobs...");
  setupRenewalCheckJob();
  setupNotificationJob();
  console.log("[Cron] All scheduled jobs are running");
};
