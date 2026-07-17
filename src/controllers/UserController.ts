import { Response } from "express";
import { AuthenticatedRequest } from "../types/index";
import { userService } from "../services/UserService";
import { UpdateUserSchema } from "../dtos/user.dto";
import { sendSuccess, sendError } from "../utils/response";
import { MESSAGES } from "../constants/index";
import { ValidationError } from "../errors/AppError";

/**
 * User Controller
 * Handles user profile requests
 */
export class UserController {
  /**
   * Get user profile
   * GET /api/v1/users/profile
   */
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const user = await userService.getProfile(req.userId);
      console.log(user);
      sendSuccess(res, 200, MESSAGES.USER_PROFILE_RETRIEVED, user);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/users/profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      // Validate input
      const validation = UpdateUserSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError(
          validation.error.issues?.[0]?.message || "Validation failed",
        );
      }

      const user = await userService.updateProfile(req.userId, validation.data);
      sendSuccess(res, 200, MESSAGES.USER_UPDATED, user);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Delete user account
   * DELETE /api/v1/users/account
   */
  async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      await userService.deleteAccount(req.userId);
      sendSuccess(res, 200, MESSAGES.USER_DELETED);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export const userController = new UserController();
