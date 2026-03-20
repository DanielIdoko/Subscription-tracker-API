import { z } from "zod";
import { SUBSCRIPTION_CATEGORIES, BILLING_CYCLES } from "../constants/index.ts";

/**
 * Subscription DTOs
 */

export const CreateSubscriptionSchema = z.object({
  name: z.string().min(1, "Subscription name is required").max(100),
  price: z.number().positive("Price must be greater than 0"),
  currency: z
    .enum(["USD", "EUR", "GBP", "CAD", "AUD", "INR", "NGN", "ZAR"])
    .default("USD"),
  billingCycle: z.enum(["monthly", "yearly"]),
  nextBillingDate: z.coerce.date().optional(),
  category: z.enum(SUBSCRIPTION_CATEGORIES as any),
  status: z.enum(["active", "cancelled", "paused"]).default("active"),
  autoRenew: z.boolean().default(true),
});

export const UpdateSubscriptionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  price: z.number().positive().optional(),
  currency: z
    .enum(["USD", "EUR", "GBP", "CAD", "AUD", "INR", "NGN", "ZAR"])
    .optional(),
  billingCycle: z.enum(["monthly", "yearly"]).optional(),
  nextBillingDate: z.coerce.date().optional(),
  category: z.enum(SUBSCRIPTION_CATEGORIES as any).optional(),
  status: z.enum(["active", "cancelled", "paused"]).optional(),
  autoRenew: z.boolean().optional(),
});

export const FilterSubscriptionsSchema = z.object({
  status: z.enum(["active", "cancelled", "paused"]).optional(),
  category: z.enum(SUBSCRIPTION_CATEGORIES as any).optional(),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Type inference
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
export type FilterSubscriptionsInput = z.infer<
  typeof FilterSubscriptionsSchema
>;
