import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// Exports for environment variables
export const {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
} = process.env;
