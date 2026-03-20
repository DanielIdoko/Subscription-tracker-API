import { subscriptionRepository } from "../repositories/SubscriptionRepository.ts";
import { userRepository } from "../repositories/UserRepository.ts";
import { Resend } from "resend";
import { config } from "../config/env.ts";

/**
 * Notification Service
 * Handles email notifications using Resend
 */
export class NotificationService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(config.RESEND_API_KEY);
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(
    email: string,
    name: string,
    verificationToken: string,
  ): Promise<void> {
    try {
      const verificationUrl = `${config.SERVER_URL}/auth/verify-email?token=${verificationToken}`;

      const { data, error } = await this.resend.emails.send({
        from: config.EMAIL_FROM!,
        to: email,
        subject: "Verify Your Email Address",
        html: `
          <h2>Welcome to Managel</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards, <br>Managel.</p>
        `,
      });

      if (error) {
        console.error("Error sending email verification:", error);
      } else {
        console.log(`Email verification sent to ${email}`);
      }
    } catch (error) {
      console.error("Error in sendEmailVerification:", error);
    }
  }
  /**
   * Send renewal reminder
   */
  async sendRenewalReminder(
    userId: string,
    subscriptionName: string,
    renewalDate: Date,
  ): Promise<void> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        console.error(`User ${userId} not found for renewal reminder`);
        return;
      }

      const { data, error } = await this.resend.emails.send({
        from: config.EMAIL_FROM || "noreply@yourapp.com",
        to: user.email,
        subject: `Subscription Renewal Reminder: ${subscriptionName}`,
        html: `
          <h2>Subscription Renewal Reminder</h2>
          <p>Hi ${user.name},</p>
          <p>Your subscription to <strong>${subscriptionName}</strong> is set to renew on <strong>${renewalDate.toDateString()}</strong>.</p>
          <p>Please ensure you have sufficient funds or update your payment method if needed.</p>
          <p>Best regards,<br>Your Subscription Team</p>
        `,
      });

      if (error) {
        console.error("Error sending renewal reminder email:", error);
      } else {
        console.log(`Renewal reminder sent to ${user.email} for ${subscriptionName}`);
      }
    } catch (error) {
      console.error("Error in sendRenewalReminder:", error);
    }
  }

  /**
   * Send subscription created notification
   */
  async sendSubscriptionCreated(
    userId: string,
    subscriptionName: string,
    price: number,
  ): Promise<void> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        console.error(`User ${userId} not found for subscription created notification`);
        return;
      }

      const { data, error } = await this.resend.emails.send({
        from: config.EMAIL_FROM!,
        to: user.email,
        subject: `Subscription Created: ${subscriptionName}`,
        html: `
          <h2>Subscription Created Successfully</h2>
          <p>Hi ${user.name},</p>
          <p>Your subscription to <strong>${subscriptionName}</strong> has been created successfully.</p>
          <p>Price: $${price}</p>
          <p>Thank you for using our service!</p>
          <p>Best regards,<br>Managel</p>
        `,
      });

      if (error) {
        console.error("Error sending subscription created email:", error);
      } else {
        console.log(`Subscription created notification sent to ${user.email}`);
      }
    } catch (error) {
      console.error("Error in sendSubscriptionCreated:", error);
    }
  }

  /**
   * Send subscription cancelled notification
   */
  async sendSubscriptionCancelled(
    userId: string,
    subscriptionName: string,
  ): Promise<void> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        console.error(`User ${userId} not found for subscription cancelled notification`);
        return;
      }

      const { data, error } = await this.resend.emails.send({
        from: config.EMAIL_FROM!,
        to: user.email,
        subject: `Subscription Cancelled: ${subscriptionName}`,
        html: `
          <h2>Subscription Cancelled</h2>
          <p>Hi ${user.name},</p>
          <p>Your subscription to <strong>${subscriptionName}</strong> has been cancelled.</p>
          <p>If this was a mistake, you can reactivate it anytime.</p>
          <p>Best regards,<br>Your Subscription Team</p>
        `,
      });

      if (error) {
        console.error("Error sending subscription cancelled email:", error);
      } else {
        console.log(`Subscription cancelled notification sent to ${user.email}`);
      }
    } catch (error) {
      console.error("Error in sendSubscriptionCancelled:", error);
    }
  }

  /**
   * Send daily spending report
   */
  async sendDailySpendingReport(
    userId: string,
    dailySpend: number,
    weeklySpend: number,
    monthlySpend: number,
  ): Promise<void> {
    console.log(`
    [Notification]
    - To: User ${userId}
    - Type: Daily Spending Report
    - Daily: $${dailySpend}
    - Weekly: $${weeklySpend}
    - Monthly: $${monthlySpend}
    - Action: Would send summary email in production
    `);
  }

  /**
   * Get upcoming renewals and send batch notifications
   */
  async sendBatchRenewalNotifications(): Promise<void> {
    try {
      // Get all subscriptions that will renew in the next 7 days
      const upcomingRenewals = await subscriptionRepository.findAllUpcomingRenewals(7);

      if (upcomingRenewals.length === 0) {
        console.log("[Notification] No upcoming renewals to notify");
        return;
      }

      console.log(`[Notification] Found ${upcomingRenewals.length} upcoming renewals`);

      // Group by user to avoid sending multiple emails
      const userRenewals = new Map<string, Array<{ name: string; nextBillingDate: Date }>>();

      for (const subscription of upcomingRenewals) {
        if (!userRenewals.has(subscription.userId)) {
          userRenewals.set(subscription.userId, []);
        }
        userRenewals.get(subscription.userId)!.push({
          name: subscription.name,
          nextBillingDate: subscription.nextBillingDate,
        });
      }

      // Send notifications for each user
      for (const [userId, renewals] of userRenewals) {
        const user = await userRepository.findById(userId);
        if (!user) continue;

        const { data, error } = await this.resend.emails.send({
          from: config.EMAIL_FROM || "noreply@yourapp.com",
          to: user.email,
          subject: "Upcoming Subscription Renewals",
          html: `
            <h2>Upcoming Subscription Renewals</h2>
            <p>Hi ${user.name},</p>
            <p>You have the following subscriptions renewing soon:</p>
            <ul>
              ${renewals.map(r => `<li><strong>${r.name}</strong> - Renews on ${r.nextBillingDate.toDateString()}</li>`).join('')}
            </ul>
            <p>Please ensure you have sufficient funds or update your payment methods.</p>
            <p>Best regards,<br>Your Subscription Team</p>
          `,
        });

        if (error) {
          console.error(`Error sending batch renewal notification to ${user.email}:`, error);
        } else {
          console.log(`Batch renewal notification sent to ${user.email}`);
        }
      }

      console.log("[Notification] Batch renewal notifications completed");
    } catch (error) {
      console.error("[Notification] Error in sendBatchRenewalNotifications:", error);
    }
  }
}

export const notificationService = new NotificationService();
