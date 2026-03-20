/**
 * Custom Application Error Class
 * Extends Error for better error handling and logging
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error - 400
 */
export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Authentication Error - 401
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization Error - 403
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = "You do not have permission to access this resource",
  ) {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Conflict Error - 409
 */
export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Internal Server Error - 500
 */
export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
    this.name = "InternalServerError";
  }
}
