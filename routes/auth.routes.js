import { Router } from "express";

const authRouter  = Router()


authRouter.get("/sign-up", (req, res) => res.json({'title': 'sign up'}))
authRouter.get("/sign-in", (req, res) => res.json({'title': 'sign in'}))
authRouter.get("/sign-out", (req, res) => res.json({'title': 'sign out'}))



export default authRouter;