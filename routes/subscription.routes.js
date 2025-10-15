import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSubscription,
  updateSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Get all subscriptions
subscriptionRouter.get("/:id", authMiddleware, getAllSubscriptions);
// Get a single subscription
subscriptionRouter.get("/:id/:subscriptionId", authMiddleware, getSubscription);
// Create/add a subscription
subscriptionRouter.post("/:id", authMiddleware, createSubscription);
// Update subscriptions
subscriptionRouter.put("/:id/:subscriptionId", authMiddleware, updateSubscription);
// Delete subscription(s)
subscriptionRouter.delete("/:id/:subscriptionId", authMiddleware, deleteSubscription);

export default subscriptionRouter;
