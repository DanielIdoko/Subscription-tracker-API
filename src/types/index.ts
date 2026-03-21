import { Request } from "express";

/**
 * Authenticated Request with user data
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Standard API Response Format
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * Pagination Details
 */
export interface PaginationDetails {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationDetails;
  statusCode: number;
}

/**
 * User Entity
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Subscription Entity
 */
export interface ISubscription {
  name: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: Date;
  category:
    | "entertainment"
    | "productivity"
    | "education"
    | "finance"
    | "health"
    | "sports"
    | "news"
    | "other";
  status: "active" | "cancelled" | "paused";
  autoRenew: boolean;
  userId: string;
  startDate: Date;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * JWT Payload
 */
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Refresh Token Payload
 */
export interface RefreshTokenPayload extends JWTPayload {}

/**
 * Dashboard Stats
 */
export interface DashboardStats {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  activeSubscriptionsCount: number;
  upcomingRenewals: Array<{
    id: string;
    name: string;
    nextBillingDate: Date;
    price: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    totalSpend: number;
  }>;
}

/**
 * Query Options for pagination/filtering
 */
export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filter?: Record<string, any>;
}
