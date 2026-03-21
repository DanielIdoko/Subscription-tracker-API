import { Response } from "express";
import { AuthenticatedRequest } from "../types/index";
import { dashboardService } from "../services/DashboardService";
import { sendSuccess, sendError } from "../utils/response";
import { MESSAGES } from "../constants/index";
import { ValidationError } from "../errors/AppError";

/**
 * Dashboard Controller
 * Handles dashboard and analytics requests
 */
export class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/v1/dashboard/stats
   */
  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const stats = await dashboardService.getDashboardStats(req.userId);
      sendSuccess(res, 200, MESSAGES.DASHBOARD_STATS_RETRIEVED, stats);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Get spending analytics
   * GET /api/v1/dashboard/spending
   */
  async getSpending(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const spending = await dashboardService.getSpendingAnalytics(req.userId);
      sendSuccess(res, 200, "Spending analytics retrieved successfully", spending);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Get category analytics
   * GET /api/v1/dashboard/categories
   */
  async getCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const categories = await dashboardService.getCategoryAnalytics(req.userId);
      sendSuccess(res, 200, "Category analytics retrieved successfully", categories);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export const dashboardController = new DashboardController();
