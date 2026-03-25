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
// let isConnected = false;

// const connectDBMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     if (!isConnected) {
//       console.log("[DB] Connecting...");
//       await connectDatabase();
//       isConnected = true;
//       console.log("[DB] Connected");
//     }
//     next();
//   } catch (error) {
//     console.error("[DB ERROR]", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Database connection failed" });
//   }
// };

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
    origin: (origin = process.env.CORS_ORIGIN, callback) => {
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
// Logging
app.use(morgan("dev"));

applySecurityMiddlewares(app);

/**
 * ROUTES
 */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    // dbConnected: isConnected,
  });
});

app.use(globalLimiter);

app.get("/", async (_req: Request, res: Response) => {
  await connectDatabase();
  res.status(200).json({
    success: true,
    message: "Managel API running successfully ",
    version: "1.0.0",
  });
});


// Apply DB connection middleware to all API routes
// apiV1.use(connectDBMiddleware);

/**
 * API ROUTES
 */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

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
