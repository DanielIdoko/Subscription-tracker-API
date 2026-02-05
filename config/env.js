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
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_TOKEN,
  FROM_EMAIL,
  FROM_NAME,
} = process.env;
