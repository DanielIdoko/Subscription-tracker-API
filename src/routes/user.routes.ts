import { Router } from "express";
import { userController } from "../controllers/UserController.ts";
import { authenticate, asyncHandler } from "../middlewares/index.ts";
import { apiLimiter } from "../middlewares/rateLimiter.ts";
import { AuthenticatedRequest } from "../types/index.ts";

const router = Router();

// All user routes require authentication
router.use(authenticate);
router.use(apiLimiter);

/**
 * User Routes
 */

// Get profile
router.get(
  "/profile",
  asyncHandler((req: AuthenticatedRequest, res: any) =>
    userController.getProfile(req, res),
  ),
);

// Update profile
router.put(
  "/profile",
  asyncHandler((req: AuthenticatedRequest, res: any) =>
    userController.updateProfile(req, res),
  ),
);

// Delete account
router.delete(
  "/account",
  asyncHandler((req: AuthenticatedRequest, res: any) =>
    userController.deleteAccount(req, res),
  ),
);

export const userRoutes = router;
