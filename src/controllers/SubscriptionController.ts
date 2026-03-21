import { Response } from "express";
import { AuthenticatedRequest } from "../types/index.ts";
import { subscriptionService } from "../services/SubscriptionService.ts";
import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
} from "../dtos/subscription.dto.ts";
import {
  sendSuccess,
  sendError,
  sendPaginated,
  calculatePagination,
} from "../utils/response.ts";
import { MESSAGES } from "../constants/index.ts";
import { ValidationError } from "../errors/AppError.ts";
import { parsePagination, parseSort } from "../utils/validation.ts";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from "../constants/index.ts";

/**
 * Subscription Controller
 * Handles subscription requests
 */
export class SubscriptionController {
  /**
   * Create a new subscription
   * POST /api/v1/subscriptions
   */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      // Validate input
      const validation = CreateSubscriptionSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError(validation.error?.message);
      }

      // Call service
      const subscription = await subscriptionService.createSubscription(
        req.userId!,
        validation.data,
      );

      if (subscription) {
        sendSuccess(res, 201, MESSAGES.SUBSCRIPTION_CREATED, subscription);
      }
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }

  /**
   * Get single subscription
   * GET /api/v1/subscriptions/:id
   */
  async getOne(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const { id } = req.params;
      const subscription = await subscriptionService.getSubscription(
        id,
        req.userId!,
      );

      sendSuccess(res, 200, MESSAGES.SUBSCRIPTION_RETRIEVED, subscription);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Get all subscriptions for user
   * GET /api/v1/subscriptions
   */
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      // Parse pagination
      const { page: pageStr, limit: limitStr, sortBy, sortOrder } = req.query;
      const pageValue = Array.isArray(pageStr) ? pageStr[0] : pageStr;
      const limitValue = Array.isArray(limitStr) ? limitStr[0] : limitStr;
      const sortByValue = Array.isArray(sortBy) ? sortBy[0] : sortBy;
      const sortOrderValue = Array.isArray(sortOrder) ? sortOrder[0] : sortOrder;
      const { page, limit } = parsePagination(
        pageValue,
        limitValue,
        DEFAULT_PAGE,
        DEFAULT_LIMIT,
        MAX_LIMIT,
      );
      const { sortBy: sort, sortOrder: order } = parseSort(
        sortByValue,
        sortOrderValue,
      );

      // Parse filters
      const filter: any = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }
      if (req.query.category) {
        filter.category = req.query.category;
      }

      // Get subscriptions
      const result = await subscriptionService.getUserSubscriptions(
        req.userId!,
        {
          page,
          limit,
          sortBy: sort,
          sortOrder: order,
          filter,
        },
      );

      // Send paginated response
      const pagination = calculatePagination(result.total, page, limit);
      sendPaginated(
        res,
        result.subscriptions,
        pagination,
        200,
        MESSAGES.SUBSCRIPTIONS_RETRIEVED,
      );
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Get active subscriptions
   * GET /api/v1/subscriptions/active
   */
  async getActive(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const subscriptions = await subscriptionService.getActiveSubscriptions(
        req.userId!,
      );

      sendSuccess(
        res,
        200,
        "Active subscriptions retrieved successfully",
        subscriptions,
      );
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Get upcoming renewals
   * GET /api/v1/subscriptions/upcoming-renewals
   */
  async getUpcomingRenewals(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const daysAhead = req.query.daysAhead
        ? parseInt(req.query.daysAhead as string, 10)
        : 7;

      const subscriptions = await subscriptionService.getUpcomingRenewals(
        req.userId!,
        daysAhead,
      );

      sendSuccess(
        res,
        200,
        "Upcoming renewals retrieved successfully",
        subscriptions,
      );
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Update subscription
   * PUT /api/v1/subscriptions/:id
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const { id } = req.params;

      // Validate input
      const validation = UpdateSubscriptionSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError(validation.error.issues?.[0]?.message || "Validation failed");
      }

      // Call service
      const subscription = await subscriptionService.updateSubscription(
        id,
        req.userId!,
        validation.data,
      );

      sendSuccess(res, 200, MESSAGES.SUBSCRIPTION_UPDATED, subscription);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Cancel subscription
   * POST /api/v1/subscriptions/:id/cancel
   */
  async cancel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const { id } = req.params;
      const subscription = await subscriptionService.cancelSubscription(
        id,
        req.userId!,
      );

      sendSuccess(
        res,
        200,
        "Subscription cancelled successfully",
        subscription,
      );
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Pause subscription
   * POST /api/v1/subscriptions/:id/pause
   */
  async pause(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const { id } = req.params;
      const subscription = await subscriptionService.pauseSubscription(
        id,
        req.userId!,
      );

      sendSuccess(res, 200, "Subscription paused successfully", subscription);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Resume subscription
   * POST /api/v1/subscriptions/:id/resume
   */
  async resume(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const { id } = req.params;
      const subscription = await subscriptionService.resumeSubscription(
        id,
        req.userId!,
      );

      sendSuccess(res, 200, "Subscription resumed successfully", subscription);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }

  /**
   * Delete subscription
   * DELETE /api/v1/subscriptions/:id
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new ValidationError("User ID not found");
      }

      const { id } = req.params;
      await subscriptionService.deleteSubscription(id, req.userId!);

      sendSuccess(res, 200, MESSAGES.SUBSCRIPTION_DELETED);
    } catch (error: any) {
      sendError(res, error.statusCode || 500, error.message);
    }
  }
}

export const subscriptionController = new SubscriptionController();
