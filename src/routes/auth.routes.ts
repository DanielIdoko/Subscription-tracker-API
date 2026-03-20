import { Router } from "express";
import { authController } from "../controllers/AuthController.ts";
import { authenticate, asyncHandler } from "../middlewares/index.ts";
import { authLimiter } from "../middlewares/rateLimiter.ts";
import { AuthenticatedRequest } from "../types/index.ts";

const router = Router();

/**
 * Authentication Routes
 */

// Register
router.post(
  "/register",
  authLimiter,
  asyncHandler((req: AuthenticatedRequest, res: any) => authController.register(req, res)),
);

// Login
router.post(
  "/login",
  authLimiter,
  asyncHandler((req: AuthenticatedRequest, res: any) => authController.login(req, res)),
);

// Refresh token
router.post(
  "/refresh",
  authLimiter,
  asyncHandler((req: AuthenticatedRequest, res: any) => authController.refresh(req, res)),
);

// Logout
router.post(
  "/logout",
  authenticate,
  asyncHandler((req: AuthenticatedRequest, res: any) => authController.logout(req, res)),
);

// Verify email
router.get(
  "/verify-email",
  asyncHandler((req: AuthenticatedRequest, res: any) => authController.verifyEmail(req, res)),
);

// Resend email verification
router.post(
  "/resend-verification",
  authLimiter,
  asyncHandler((req: AuthenticatedRequest, res: any) => authController.resendEmailVerification(req, res)),
);

export const authRoutes = router;
