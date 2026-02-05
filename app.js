import express from "express";
import cors from 'cors'
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import { authRouter, subscriptionRouter, userRouter } from "./routes/index.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();


// For your cors - if you would be connecting this API to a frontend
let corsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}

app.use(cors(corsOptions))

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use(arcjetMiddleware);
app.use(cookieParser());
app.use(errorMiddleware);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

// This below is just to make sure that you don't get "Cannot GET '/'" from Nodejs
app.get("/", (req, res) => {
  res.send(
    "This is a service developed to make automation and management for user's subscriptions easy. Check out the docs on github -> <a>https://github.com/DanielIdoko/Subscription-tracker-API</a>",
  );
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Health Ok!",
  });
});

// Run server
app.listen(PORT, async () => {
  console.log(`App running on port http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
