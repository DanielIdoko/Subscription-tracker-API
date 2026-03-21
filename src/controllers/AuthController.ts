import { Response } from "express";
import { AuthenticatedRequest } from "../types/index";
import { authService } from "../services/AuthService";
import { RegisterUserSchema, LoginUserSchema, RefreshTokenSchema } from "../dtos/user.dto";
import { sendSuccess, sendError } from "../utils/response";
import { MESSAGES } from "../constants/index";
import { ValidationError } from "../errors/AppError";

/**
 * Auth Controller
 * Handles authentication requests
 */
export class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validate input
      const validation = RegisterUserSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError(validation.error.issues?.[0]?.message || "Validation failed");
      }

      // Call service
      const result = await authService.register(validation.data);

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, 201, MESSAGES.REGISTER_SUCCESS, {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validate input
      const validation = LoginUserSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError(validation.error.issues?.[0]?.message || "Validation failed");
      }

      // Call service
      const result = await authService.login(validation.data);

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, 200, MESSAGES.LOGIN_SUCCESS, {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  async refresh(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Get refresh token from cookie or body
      const refreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

      // Validate input
      const validation = RefreshTokenSchema.safeParse({ refreshToken });
      if (!validation.success) {
        throw new ValidationError(validation.error.issues?.[0]?.message || "Validation failed");
      }

      // Call service
      const result = await authService.refreshAccessToken(validation.data.refreshToken);

      // Update refresh token cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, 200, MESSAGES.TOKEN_REFRESHED, {
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      await authService.logout(req.userId);

      // Clear refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendSuccess(res, 200, MESSAGES.LOGOUT_SUCCESS);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Verify email
   * GET /auth/verify-email?token=...
   */
  async verifyEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        throw new ValidationError("Verification token is required");
      }

      const result = await authService.verifyEmail(token);

      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Resend email verification
   * POST /auth/resend-verification
   */
  async resendEmailVerification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ValidationError("Email is required");
      }

      const result = await authService.resendEmailVerification(email);

      sendSuccess(res, 200, result.message);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export const authController = new AuthController();
