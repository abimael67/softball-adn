import { z } from "zod";
import type { RouteHandler, MiddlewareContext } from "./auth";
import type { Env } from "../types";
import { AppError } from "../errors";
import { ERROR_CODES } from "../constants";

export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (request: Request, env: Env, ctx: MiddlewareContext, data: T) => Promise<Response>,
): RouteHandler {
  return async (request, env, ctx) => {
    let body: unknown;

    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
    }

    const result = schema.safeParse(body);

    if (!result.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        400,
        result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
      );
    }

    return handler(request, env, ctx, result.data);
  };
}
