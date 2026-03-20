import helmet from "helmet";
import express from "express";
import { config } from "../config/env.ts";

/**
 * Apply Security Middlewares
 */
export const applySecurityMiddlewares = (app: express.Application): void => {
  // Helmet for security headers
  app.use(helmet());

  // CORS Configuration
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.CORS_ORIGIN);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });

  // Body Parser with size limits
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
};
