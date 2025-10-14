import express from "express";
// const cors = require('cors')
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import {
  authRouter,
  subscriptionRouter,
  userRouter,
} from "./routes/index.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

// For your cors - if you would be connecting this API to a frontend
// let corsOptions = {
//     origin: 'http://localhost:PORT',
//     methods: ['GET','POST','PUT','DELETE','PATCH'],
// }

// app.use(cors(corsOptions))

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(arcjetMiddleware);
app.use(cookieParser());

// Prependings for separate routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user/subscriptions", subscriptionRouter);
app.use(errorMiddleware);

// This below is just to make sure that you don't get "Cannot GET '/'" from Nodejs
app.get("/", (req, res) => {
  res.send(
    "This is a service developed to make automation and management for user's subscriptions easy. Check out the docs on github -> <a>https://github.com/DanielIdoko/Subscription-tracker-API</a>"
  );
});

// Run server
app.listen(PORT, async () => {
  console.log(`App running on port http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;
