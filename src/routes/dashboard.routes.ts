import { Router } from "express";
import { dashboardController } from "../controllers/DashboardController.ts";
import { authenticate, asyncHandler } from "../middlewares/index.ts";
import { apiLimiter } from "../middlewares/rateLimiter.ts";
import { AuthenticatedRequest } from "../types/index.ts";

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);
router.use(apiLimiter);

/**
 * Dashboard Routes
 */

// Get dashboard stats
router.get("/stats", asyncHandler((req: AuthenticatedRequest, res: any) => dashboardController.getStats(req, res)));

// Get spending analytics
router.get("/spending", asyncHandler((req: AuthenticatedRequest, res: any) => dashboardController.getSpending(req, res)));

// Get category analytics
router.get(
  "/categories",
  asyncHandler((req: AuthenticatedRequest, res: any) => dashboardController.getCategories(req, res)),
);

export const dashboardRoutes = router;
