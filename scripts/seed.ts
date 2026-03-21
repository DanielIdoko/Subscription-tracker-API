import mongoose from "mongoose";
import { config } from "../src/config/env.ts";
import { User } from "../src/models/User.ts";
import { Subscription } from "../src/models/Subscription.ts";
import { hashPassword } from "../src/utils/password.ts";

const seedData = async (): Promise<void> => {
  try {
    // Connect to database
    console.log("[Seed] Connecting to MongoDB...");
    await mongoose.connect(config.MONGODB_URI!);
    console.log("[Seed] Connected to MongoDB");

    // Clear existing data
    console.log("[Seed] Clearing existing data...");
    await User.deleteMany({});
    await Subscription.deleteMany({});

    // Create test users
    console.log("[Seed] Creating test users...");
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: await hashPassword("Password123"),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await hashPassword("Password123"),
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: await hashPassword("Password123"),
      },
    ]);

    console.log(`[Seed] Created ${users.length} users`);

    if (users.length < 3) {
      throw new Error("Failed to create all users");
    }

    // Create test subscriptions
    console.log("[Seed] Creating test subscriptions...");

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const subscriptions = await Subscription.create([
      // John's subscriptions
      {
        name: "Netflix",
        price: 15.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "entertainment",
        status: "active",
        autoRenew: true,
        userId: users[0]._id,
        startDate: now,
      },
      {
        name: "Spotify",
        price: 9.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "entertainment",
        status: "active",
        autoRenew: true,
        userId: users[0]._id,
        startDate: now,
      },
      {
        name: "Microsoft 365",
        price: 99,
        currency: "USD",
        billingCycle: "yearly",
        nextBillingDate: nextYear,
        category: "productivity",
        status: "active",
        autoRenew: true,
        userId: users[0]._id,
        startDate: now,
      },
      {
        name: "Adobe Creative Cloud",
        price: 54.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "productivity",
        status: "active",
        autoRenew: true,
        userId: users[0]._id,
        startDate: now,
      },

      // Jane's subscriptions
      {
        name: "Disney+",
        price: 10.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "entertainment",
        status: "active",
        autoRenew: true,
        userId: users[1]._id,
        startDate: now,
      },
      {
        name: "Grammarly Premium",
        price: 12.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "productivity",
        status: "active",
        autoRenew: true,
        userId: users[1]._id,
        startDate: now,
      },
      {
        name: "Duolingo Plus",
        price: 9.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "education",
        status: "active",
        autoRenew: true,
        userId: users[1]._id,
        startDate: now,
      },

      // Bob's subscriptions
      {
        name: "Apple TV+",
        price: 9.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "entertainment",
        status: "active",
        autoRenew: true,
        userId: users[2]._id,
        startDate: now,
      },
      {
        name: "LinkedIn Premium",
        price: 39.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "productivity",
        status: "active",
        autoRenew: true,
        userId: users[2]._id,
        startDate: now,
      },
      {
        name: "Notion Plus",
        price: 10,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: nextMonth,
        category: "productivity",
        status: "active",
        autoRenew: true,
        userId: users[2]._id,
        startDate: now,
      },
      {
        name: "Cancelled Subscription",
        price: 5.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        category: "other",
        status: "cancelled",
        autoRenew: false,
        userId: users[2]._id,
        startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        cancelledAt: now,
      },
    ]);

    console.log(`[Seed] Created ${subscriptions.length} subscriptions`);

    // Print seed data info
    console.log(`
╔════════════════════════════════════════════════════════════╗
║        Seed Data Successfully Created!                     ║
╠════════════════════════════════════════════════════════════╣
║  Users: ${users.length}                                             ║
║  Subscriptions: ${subscriptions.length}                                        ║
║                                                            ║
║  Test Credentials:                                         ║
║  - Email: john@example.com | Password: Password123        ║
║  - Email: jane@example.com | Password: Password123        ║
║  - Email: bob@example.com  | Password: Password123        ║
╚════════════════════════════════════════════════════════════╝
    `);

    // Disconnect
    await mongoose.disconnect();
    console.log("[Seed] Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed
seedData().catch(console.error);
