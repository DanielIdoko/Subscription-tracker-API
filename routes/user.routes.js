import { Router } from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Routes
userRouter.get("/:id", authMiddleware, getUser);
userRouter.put("/:id", authMiddleware, updateUser);
userRouter.delete("/:id", authMiddleware, deleteUser);

export default userRouter;
