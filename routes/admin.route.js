import { Router } from "express";
import { signOut, signUp, signIn } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/sign-up", signUp)
adminRouter.post("/sign-in", signIn)
adminRouter.post("/sign-out", signOut)

export default adminRouter;