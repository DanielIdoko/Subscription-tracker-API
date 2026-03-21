import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import { config } from "./src/config/env";
import { connectDatabase } from "./src/database/connection";
import { applySecurityMiddlewares } from "./src/middlewares/security";
import { globalLimiter } from "./src/middlewares/rateLimiter";
import { errorHandler, notFoundHandler } from "./src/middlewares";

// Routes
import { authRoutes } from "./src/routes/auth.routes";
import { userRoutes } from "./src/routes/user.routes";
import { subscriptionRoutes } from "./src/routes/subscription.routes";
import { dashboardRoutes } from "./src/routes/dashboard.routes";

const app: Application = express();

/**
 * IMPORTANT: Connect DB (cached inside function)
 */
let isConnected = false;

const connectDBOnce = async () => {
  try {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
      console.log("[DB] Connected successfully");
    }
  } catch (error) {
    console.error("[DB] Connection failed:", error);
    throw error;
  }
};

/**
 * MIDDLEWARES
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://managel-app.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("combined"));

applySecurityMiddlewares(app);
app.use(globalLimiter);

app.options("*", cors());

/**
 * ROUTES
 */
app.get("/health", async (_req: Request, res: Response) => {
  await connectDBOnce();

  res.status(200).json({
    success: true,
    message: "Server is running (Vercel)",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Managel API",
    version: "1.0.1",
  });
});


const apiV1 = express.Router();

apiV1.use("/auth", authRoutes);
apiV1.use("/users", userRoutes);
apiV1.use("/subscriptions", subscriptionRoutes);
apiV1.use("/dashboard", dashboardRoutes);

app.use(
  "/api/v1",
  async (req, res, next) => {
    await connectDBOnce();
    next();
  },
  apiV1,
);

/**
 * ERROR HANDLING
 */
app.use(notFoundHandler);
app.use(errorHandler as any);

// Global error handlers for serverless environment
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
