import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    // In serverless environments, throw error to fail fast
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  // Server
  PORT: parseInt(process.env.PORT!, 10),
  NODE_ENV: process.env.NODE_ENV,
  SERVER_URL: process.env.SERVER_URL,

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN,

  // Email/Notifications (optional, for simulation)
  ENABLE_EMAIL_NOTIFICATIONS: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
  EMAIL_FROM: process.env.EMAIL_FROM,
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // Rate Limiting
  ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== "false",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS!, 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 10),
};
