
import mongoose from "mongoose";
import { config } from "../config/env.ts";

/**
 * Connect to MongoDB
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Database already connected");
      return;
    }

    await mongoose.connect(config.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log("Database connected successfully");

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.log("✗ Database connection lost");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✓ Database reconnected");
    });
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    throw error; // Re-throw to fail the function
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("✓ Database disconnected");
  } catch (error) {
    console.error("✗ Error disconnecting database:", error);
    throw error;
  }
};

/**
 * Get database connection status
 */
export const getDatabaseStatus = (): boolean => {
  return mongoose.connection.readyState === 1;
};
