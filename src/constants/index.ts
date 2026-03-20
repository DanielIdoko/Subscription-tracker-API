/**
 * Subscription Categories
 */
export const SUBSCRIPTION_CATEGORIES = [
  "entertainment",
  "productivity",
  "education",
  "finance",
  "health",
  "sports",
  "news",
  "other",
] as const;

/**
 * Subscription Status
 */
export const SUBSCRIPTION_STATUS = ["active", "cancelled", "paused"] as const;

/**
 * Billing Cycles
 */
export const BILLING_CYCLES = ["monthly", "yearly"] as const;

/**
 * Currencies
 */
export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "INR",
  "NGN",
  "ZAR",
] as const;

/**
 * Date Formats
 */
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";

/**
 * Pagination Defaults
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * JWT Config
 */
export const JWT_EXPIRES_IN_HOURS = 24; // 24 hours
export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7; // 7 days

/**
 * API Response Messages
 */
export const MESSAGES = {
  // Auth
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_ALREADY_EXISTS: "User with this email already exists",
  INVALID_TOKEN: "Invalid or expired token",

  // User
  USER_PROFILE_RETRIEVED: "User profile retrieved successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User account deleted successfully",

  // Subscription
  SUBSCRIPTION_CREATED: "Subscription created successfully",
  SUBSCRIPTION_RETRIEVED: "Subscription retrieved successfully",
  SUBSCRIPTION_UPDATED: "Subscription updated successfully",
  SUBSCRIPTION_DELETED: "Subscription deleted successfully",
  SUBSCRIPTIONS_RETRIEVED: "Subscriptions retrieved successfully",

  // Dashboard
  DASHBOARD_STATS_RETRIEVED: "Dashboard statistics retrieved successfully",

  // Errors
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Bad request",
  INTERNAL_ERROR: "Internal server error",
  DATABASE_ERROR: "Database operation failed",
};

/**
 * Error Codes
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  DATABASE_ERROR: "DATABASE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

/**
 * Rate Limiting Config
 */
export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later",
};

/**
 * Cron Jobs Timing
 */
export const CRON_TIMING = {
  CHECK_RENEWALS: "0 0 * * *", // Every day at midnight
  SEND_NOTIFICATIONS: "0 12 * * *", // Every day at noon
  CLEANUP_LOGS: "0 3 * * 0", // Every Sunday at 3am
};
