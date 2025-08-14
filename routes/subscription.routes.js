import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {createSubscription, getUserSubscriptions, getAllSubscriptions} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.get("/", adminMiddleware, getAllSubscriptions)

subscriptionRouter.post("/", authMiddleware, createSubscription)

subscriptionRouter.put("/:id", (req, res) => res.send({title: "Update subscriptions"}))

subscriptionRouter.delete("/:id", (req, res) => res.send({title: "Delete subscriptions"}))

subscriptionRouter.get("/user/:id", authMiddleware, getUserSubscriptions)
subscriptionRouter.put("/:id/cancel", (req, res) => res.send({title: "Cancel subscriptions"}))
subscriptionRouter.get("/upcoming-renewals", (req, res) => res.send({title: "get upcoming subscriptons"}))

export default subscriptionRouter;