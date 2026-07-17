import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDatabase } from "./src/database/connection.js";
import { globalLimiter } from "./src/middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./src/middlewares/index.js";

// Routes
import { authRoutes } from "./src/routes/auth.routes.js";
import { userRoutes } from "./src/routes/user.routes.js";
import { subscriptionRoutes } from "./src/routes/subscription.routes.js";
import { dashboardRoutes } from "./src/routes/dashboard.routes.js";

const PORT = process.env.PORT || 5500;
const app: Application = express();

/**
 * MIDDLEWARES
 */
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://managel-app.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(globalLimiter);

/**
 * ROUTES
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server health OK!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API test ran successfully",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Managel API running successfully",
    version: "1.0.0",
    dbConnected: true,
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(Number(PORT), "0.0.0.0", async () => {
  try {
    await connectDatabase();
    console.log(`Server running securely on port ${PORT}`);
  } catch (error) {
    console.error("Database failed to connect on startup:", error);
  }
});

export default app;
