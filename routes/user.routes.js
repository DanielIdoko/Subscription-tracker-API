import { Router } from "express";
import { getUser, getUsers} from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'

const userRouter = Router();

// Routes with middlewares
userRouter.get("/", adminMiddleware, getUsers)
userRouter.get("/:id", authMiddleware, getUser)

// Routes without middlewares
userRouter.post("/", (req, res)=> res.send({title: "Create a new user"}))
userRouter.put("/:id", (req, res)=> res.send({title: "Update user"}))
userRouter.delete("/:id", (req, res)=> res.send({title: "Delete a specific user"}))


export default userRouter