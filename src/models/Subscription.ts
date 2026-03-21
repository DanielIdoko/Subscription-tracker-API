import mongoose, { Document, Schema } from "mongoose";
import { ISubscription } from "../types/index.ts";
import { SUBSCRIPTION_CATEGORIES } from "../constants/index.ts";

interface ISubscriptionDocument extends ISubscription, Document {}

const subscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: [1, "Name is required"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "NGN", "ZAR"],
      default: "USD",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: [true, "Billing cycle is required"],
    },
    nextBillingDate: {
      type: Date,
      required: [true, "Next billing date is required"],
      index: true,
    },
    category: {
      type: String,
      enum: SUBSCRIPTION_CATEGORIES as any,
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "paused"],
      default: "active",
      index: true,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for common queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ userId: 1, nextBillingDate: 1 });
subscriptionSchema.index({ userId: 1, category: 1 });
subscriptionSchema.index({ userId: 1, createdAt: -1 });

// Pre-save middleware to log subscription creation
subscriptionSchema.pre("save", function (next: any) {
  if (this.isNew) {
    console.log(`[Subscription] New subscription created: ${this.name} by user ${this.userId?.toString()}`);
  }
  next();
});

export const Subscription = mongoose.model<ISubscriptionDocument>(
  "Subscription",
  subscriptionSchema,
);
