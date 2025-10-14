import { Router } from "express";
import { signOut, signUp, signIn } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const authRouter = Router();

authRouter.post("/sign-up", signUp)
authRouter.post("/login", signIn)
authRouter.post("/sign-out", authMiddleware, signOut)

export default authRouter;