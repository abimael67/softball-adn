import { ERROR_CODES, ERROR_MESSAGES } from "../constants";
import type { ApiResponse } from "../types";

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message?: string,
  ) {
    super(message || ERROR_MESSAGES[code] || "Unknown error");
    this.name = "AppError";
  }
}

export function createErrorResponse(error: unknown): ApiResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  return {
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    },
  };
}

export function getStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

export function jsonResponse(data: ApiResponse, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
