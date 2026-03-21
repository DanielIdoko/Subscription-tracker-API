import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// import { config } from "./src/config/env";
import { connectDatabase } from "./src/database/connection";
import { applySecurityMiddlewares } from "./src/middlewares/security";
import { globalLimiter } from "./src/middlewares/rateLimiter";
import { errorHandler, notFoundHandler } from "./src/middlewares";

// Routes
import { authRoutes } from "./src/routes/auth.routes";
import { userRoutes } from "./src/routes/user.routes";
import { subscriptionRoutes } from "./src/routes/subscription.routes";
import { dashboardRoutes } from "./src/routes/dashboard.routes";
import helmet from "helmet";

const app: Application = express();

/**
 * DATABASE CONNECTION (Serverless Optimized)
 */
let isConnected = false;

const connectDBMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isConnected) {
      console.log("[DB] Connecting...");
      await connectDatabase();
      isConnected = true;
      console.log("[DB] Connected");
    }
    next();
  } catch (error) {
    console.error("[DB ERROR]", error);
    res
      .status(500)
      .json({ success: false, message: "Database connection failed" });
  }
};

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
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// 2. Parsers & Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(morgan("dev")); // 'dev' is often cleaner for logs than 'combined'

applySecurityMiddlewares(app);
// Move rate limiter AFTER static/health checks if you want to save quota
app.use(globalLimiter);

/**
 * ROUTES
 */
app.get("/health", connectDBMiddleware, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    dbConnected: isConnected,
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Managel API",
    version: "1.0.1",
  });
});

// API v1 Router
const apiV1 = express.Router();

// Apply DB connection middleware to all API routes
apiV1.use(connectDBMiddleware);

app.use("/api/v1", apiV1);
apiV1.use("/", (req, res) => res.json({ message: "api/v1 running" }));
apiV1.use("/auth", authRoutes);
apiV1.use("/users", userRoutes);
apiV1.use("/subscriptions", subscriptionRoutes);
apiV1.use("/dashboard", dashboardRoutes);

/**
 * ERROR HANDLING
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
// Minimal strip
// import express from "express";

// const app = express();

// app.get("/", (req, res) => {
//   res.json({ message: "API working" });
// });

// export default app;
