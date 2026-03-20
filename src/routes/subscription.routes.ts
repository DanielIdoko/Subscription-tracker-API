import { Router } from "express";
import { subscriptionController } from "../controllers/SubscriptionController.ts";
import { authenticate, asyncHandler } from "../middlewares/index.ts";
import { apiLimiter } from "../middlewares/rateLimiter.ts";
import { AuthenticatedRequest } from "../types/index.ts";

const router = Router();

// All subscription routes require authentication
router.use(authenticate);
router.use(apiLimiter);

/**
 * Subscription Routes
 */

// Get all subscriptions
router.get("/", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.getAll(req, res)));

// Get active subscriptions
router.get("/active", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.getActive(req, res)));

// Get upcoming renewals
router.get(
  "/upcoming-renewals",
  asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.getUpcomingRenewals(req, res)),
);

// Create subscription
router.post("/", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.create(req, res)));

// Get single subscription
router.get("/:id", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.getOne(req, res)));

// Update subscription
router.put("/:id", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.update(req, res)));

// Cancel subscription
router.post("/:id/cancel", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.cancel(req, res)));

// Pause subscription
router.post("/:id/pause", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.pause(req, res)));

// Resume subscription
router.post(
  "/:id/resume",
  asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.resume(req, res)),
);

// Delete subscription
router.delete("/:id", asyncHandler((req: AuthenticatedRequest, res: any) => subscriptionController.delete(req, res)));

export const subscriptionRoutes = router;
