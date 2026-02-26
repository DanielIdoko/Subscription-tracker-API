/**
 * Modern Bun Native API Response Utility
 * No framework dependencies.
 */

import type { HeadersInit } from "bun";

type Meta = Record<string, unknown>;

type ApiOptions<T = unknown> = {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  meta?: Meta;
  errors?: unknown;
  headers?: HeadersInit;
};

export class ApiResponse {
  private static json(body: unknown, status: number, headers?: HeadersInit) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }

  // ============================================================================
  // Custom
  // ============================================================================

  static custom<T = unknown>({
    success,
    status,
    data,
    message,
    meta,
    errors,
    headers,
  }: ApiOptions<T>) {
    return this.json(
      {
        success,
        ...(message && { message }),
        ...(data !== undefined && { data }),
        ...(meta && { meta }),
        ...(errors && { errors }),
      },
      status,
      headers,
    );
  }

  // ============================================================================
  // Success
  // ============================================================================

  static success<T>(data: T, message?: string, meta?: Meta) {
    return this.json(
      {
        success: true,
        ...(message && { message }),
        data,
        ...(meta && { meta }),
      },
      200,
    );
  }

  static created<T>(data: T, message = "Resource created successfully") {
    return this.json(
      {
        success: true,
        message,
        data,
      },
      201,
    );
  }

  static noContent() {
    return new Response(null, { status: 204 });
  }

  // ============================================================================
  // Client Errors
  // ============================================================================

  static badRequest(message = "Bad request", errors?: unknown) {
    return this.json(
      { success: false, message, ...{(errors && { errors }) },
      400,
    );
  }

  static unauthorized(message = "Unauthorized") {
    return this.json({ success: false, message }, 401);
  }

  static forbidden(message = "Forbidden") {
    return this.json({ success: false, message }, 403);
  }

  static notFound(message = "Resource not found") {
    return this.json({ success: false, message }, 404);
  }

  static conflict(message = "Conflict") {
    return this.json({ success: false, message }, 409);
  }

  static unprocessableEntity(message = "Validation failed", errors?: unknown) {
    return this.json(
      { success: false, message, ...(errors && { errors }) },
      422,
    );
  }

  // ============================================================================
  // Server Errors
  // ============================================================================

  static serverError(error?: unknown, message = "Internal server error") {
    console.error("Server Error:", error);

    const isDev = process.env.NODE_ENV === "development";

    return this.json(
      {
        success: false,
        message,
        ...(isDev &&
          error instanceof Error && {
            error: error.message,
            stack: error.stack,
          }),
      },
      500,
    );
  }

  // ============================================================================
  // Pagination
  // ============================================================================

  static paginated<T>(data: T[], pagination: PaginationMeta, message?: string) {
    return this.json(
      {
        success: true,
        ...(message && { message }),
        data,
        meta: { pagination },
      },
      200,
    );
  }

  static buildPaginationMeta(
    total: number,
    page: number,
    limit: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
