import { ValidationError } from "../errors/AppError";

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
};

/**
 * Sanitize input to prevent NoSQL injection
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input.replace(/[{}$]/g, "");
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};

    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }

    return sanitized;
  }

  return input;
};

/**
 * Parse pagination parameters
 */
export const parsePagination = (
  page?: string | number,
  limit?: string | number,
  defaultPage: number = 1,
  defaultLimit: number = 10,
  maxLimit: number = 100,
): { page: number; limit: number } => {
  let parsedPage = defaultPage;
  let parsedLimit = defaultLimit;

  if (page) {
    const p = parseInt(String(page), 10);
    if (!isNaN(p) && p > 0) {
      parsedPage = p;
    }
  }

  if (limit) {
    const l = parseInt(String(limit), 10);
    if (!isNaN(l) && l > 0 && l <= maxLimit) {
      parsedLimit = l;
    } else if (!isNaN(l) && l > maxLimit) {
      parsedLimit = maxLimit;
    }
  }

  return { page: parsedPage, limit: parsedLimit };
};

/**
 * Parse sort parameters
 */
export const parseSort = (
  sortBy?: string,
  sortOrder?: string,
): { sortBy: string; sortOrder: "asc" | "desc" } => {
  const validOrder =
    sortOrder && (sortOrder === "asc" || sortOrder === "desc")
      ? sortOrder
      : "desc";

  return {
    sortBy: sortBy || "createdAt",
    sortOrder: validOrder,
  };
};

/**
 * Validate ObjectId format
 */
export const validateObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Async validation wrapper
 */
export const throwIfValidationFails = async (
  validationFn: () => Promise<void>,
): Promise<void> => {
  try {
    await validationFn();
  } catch (error: any) {
    throw new ValidationError(error.message);
  }
};
