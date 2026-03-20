import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.ts";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt.ts";
import { AuthenticationError } from "../errors/AppError.ts";

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 * and attaches user info to request
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AuthenticationError("No authorization header provided");
  }

  const token = extractTokenFromHeader(authHeader);
  const payload = verifyToken(token);

  req.userId = payload.userId;
  req.user = {
    id: payload.userId,
    email: payload.email,
    name: "", // Can be populated from DB if needed
  };

  next();
};

/**
 * Error Handler Middleware
 * Centralized error handling
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("Error:", err);

  // Handle operational errors
  if (err instanceof Error && (err as any).statusCode) {
    const appError = err as any;
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      error: err.message,
      statusCode: appError.statusCode,
    });
  } else {
    // Handle unknown errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      statusCode: 500,
    });
  }
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * 404 Handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
};
