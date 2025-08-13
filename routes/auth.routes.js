import { Router } from "express";
import { signOut, signUp, signIn } from "../controllers/auth.controller";


const authRouter  = Router()

authRouter.post("/sign-up", (req, res) => signUp)
authRouter.post("/sign-in", (req, res) => signIn)
authRouter.post("/sign-out", (req, res) => signOut)


export default authRouter;