import { Response } from "express";
import { AuthenticatedRequest } from "../types/index.ts";
import { userService } from "../services/UserService.ts";
import { UpdateUserSchema } from "../dtos/user.dto.ts";
import { sendSuccess, sendError } from "../utils/response.ts";
import { MESSAGES } from "../constants/index.ts";
import { ValidationError } from "../errors/AppError.ts";

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
        throw new ValidationError(validation.error.errors[0].message);
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
