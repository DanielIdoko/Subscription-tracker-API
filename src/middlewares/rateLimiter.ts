import rateLimit from "express-rate-limit";
import { config } from "../config/env";

/**
 * Global Rate Limiter
 */
export const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutes by default
  max: config.RATE_LIMIT_MAX_REQUESTS, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => {
    // Skip rate limiting in development
    return config.NODE_ENV === "development";
  },
  validate: { xForwardedForHeader: false },
});

/**
 * Auth Routes Rate Limiter (stricter)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * API Routes Rate Limiter (moderate)
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: "Too many API requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
