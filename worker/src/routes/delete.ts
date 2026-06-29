import type { RouteHandler, MiddlewareContext } from "../middleware/auth";
import type { Env } from "../types";
import { AppError } from "../errors";
import { ERROR_CODES } from "../constants";
import { createR2Service } from "../services/r2";
import { logger } from "../utils/logger";

export const deleteHandler: RouteHandler = async (
  request: Request,
  env: Env,
  ctx: MiddlewareContext,
): Promise<Response> => {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    throw new AppError(ERROR_CODES.BAD_REQUEST, 400, "No key provided");
  }

  const sanitizedKey = key.replace(/\.\./g, "").replace(/\/+/g, "/");

  const r2 = createR2Service(env);

  const exists = await r2.exists(sanitizedKey);
  if (!exists) {
    throw new AppError(ERROR_CODES.NOT_FOUND, 404, "File not found");
  }

  await r2.delete(sanitizedKey);

  logger.info("Delete successful", {
    key: sanitizedKey,
    userId: ctx.auth?.userId,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
