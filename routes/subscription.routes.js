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
subscriptionRouter.get("/", authMiddleware, getAllSubscriptions);
// Get a single subscription
subscriptionRouter.get("/:id", authMiddleware, getSubscription);
// Create/add a subscription
subscriptionRouter.post("/", authMiddleware, createSubscription);
// Update subscriptions
subscriptionRouter.put("/:id", authMiddleware, updateSubscription);
// Delete subscription(s)
subscriptionRouter.delete("/:id", authMiddleware, deleteSubscription);

export default subscriptionRouter;
