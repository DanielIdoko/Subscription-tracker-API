import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "./src/config/env.ts";
import { connectDatabase } from "./src/database/connection.ts";
import { setupAllCronJobs } from "./src/jobs/cron.ts";
import { applySecurityMiddlewares } from "./src/middlewares/security.ts";
import { globalLimiter } from "./src/middlewares/rateLimiter.ts";
import { errorHandler, notFoundHandler } from "./src/middlewares/index.ts";

// Import routes
import { authRoutes } from "./src/routes/auth.routes.ts";
import { userRoutes } from "./src/routes/user.routes.ts";
import { subscriptionRoutes } from "./src/routes/subscription.routes.ts";
import { dashboardRoutes } from "./src/routes/dashboard.routes.ts";

const app: Application = express();
const PORT = config.PORT;

/**
 * Initialize Application
 */
// async function initializeApp(): Promise<void> {
//   try {
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

// Logging
app.use(morgan("combined"));

// Rate limiting
app.use(globalLimiter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Managel API",
    version: "1.0.1",
    docs: "/api/v1/docs",
  });
});

/**
 * API Routes (v1)
 */
const apiV1 = express.Router();

// Authentication routes (public)
apiV1.use("/auth", authRoutes);

// User routes (protected)
apiV1.use("/users", userRoutes);

// Subscription routes (protected)
apiV1.use("/subscriptions", subscriptionRoutes);

// Dashboard routes (protected)
apiV1.use("/dashboard", dashboardRoutes);

// Mount API routes
app.use("/api/v1", apiV1);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler as any);

// Setup cron jobs
console.log("[App] Setting up cron jobs...");
setupAllCronJobs();

// Start server
app.listen(PORT, async () => {
  // Apply security middlewares
  console.log("[App] Applying security middlewares...");
  applySecurityMiddlewares(app);
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     Managel API Server Started!                            ║
╠════════════════════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}${" ".repeat(47 - PORT.toString().length)}║
║  Environment: ${config.NODE_ENV}${" ".repeat(43 - config.NODE_ENV!.length)}   ║
║  Docs: http://localhost:${PORT}/api/docs${" ".repeat(44 - PORT.toString().length)}║
╚════════════════════════════════════════════════════════════╝
      `);
  await connectDatabase();
});
//   } catch (error) {
//     console.error("[App] Failed to initialize application:", error);
//     process.exit(1);
//   }
// }

// Handle unhandled rejections
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("[App] Unhandled Rejection at:", promise, "reason", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: any) => {
  console.error("[App] Uncaught Exception:", error);
  process.exit(1);
});

// Start the application
