import { Router } from "express";
import { signOut, signUp, signIn } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const authRouter = Router();

authRouter.post("/signup", signUp)
authRouter.post("/login", signIn)
authRouter.post("/signout/:id", authMiddleware, signOut)

export default authRouter;