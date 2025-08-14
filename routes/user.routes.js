import { Router } from "express";
import { getUser, getUsers, deleteUser, updateUser} from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import adminMiddleware from '../middlewares/admin.middleware.js'

const userRouter = Router();

// Routes with middlewares
userRouter.get("/", adminMiddleware, getUsers)
userRouter.get("/:id", authMiddleware, getUser)

// Routes without middlewares
userRouter.delete("/:id", deleteUser)
userRouter.put("/:id", updateUser)

export default userRouter