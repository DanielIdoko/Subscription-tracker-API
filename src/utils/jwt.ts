import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/index.ts";
import { AuthenticationError } from "../errors/AppError.ts";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || "7d";

/**
 * Generate JWT Token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET as string, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    throw new AuthenticationError("Invalid or expired token");
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    throw new AuthenticationError("Invalid or expired refresh token");
  }
};

/**
 * Decode Token (without verification)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader) {
    throw new AuthenticationError("No authorization header provided");
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0]!.toLowerCase() !== "bearer") {
    throw new AuthenticationError("Invalid authorization header format");
  }

  return parts[1]!;
};
