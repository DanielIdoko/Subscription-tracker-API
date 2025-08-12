import { Router } from "express";

const userRouter = Router();



userRouter.get("/", (req, res)=> res.send({title: "Get all users"}))
userRouter.get("/:id", (req, res)=> res.send({title: "Get user details"}))
userRouter.post("/:id", (req, res)=> res.send({title: "Create a new user"}))
userRouter.put("/", (req, res)=> res.send({title: "Update users"}))
userRouter.delete("/:id", (req, res)=> res.send({title: "Delete a specific user"}))


export default userRouter