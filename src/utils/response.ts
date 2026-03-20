import { Response } from "express";
import { ApiResponse, PaginatedResponse, PaginationDetails } from "../types/index.ts";

/**
 * Send Success Response
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number = 200,
  message: string = "Success",
  data?: T,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    statusCode,
  };

  res.status(statusCode).json(response);
};

/**
 * Send Paginated Response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginationDetails,
  statusCode: number = 200,
  message: string = "Data retrieved successfully",
): void => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination,
    statusCode,
  };

  res.status(statusCode).json(response);
};

/**
 * Calculate Pagination Details
 */
export const calculatePagination = (
  total: number,
  page: number,
  limit: number,
): PaginationDetails => {
  const pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

/**
 * Send Error Response
 */
export const sendError = (
  res: Response,
  statusCode: number = 500,
  message: string = "Internal server error",
  error?: any,
): void => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error: error?.message || error,
    statusCode,
  };

  res.status(statusCode).json(response);
};
