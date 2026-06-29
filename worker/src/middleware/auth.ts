import type { Env, AuthContext } from "../types";
import { AppError } from "../errors";
import { ERROR_CODES } from "../constants";
import { verifySupabaseToken } from "../services/supabase";
import { logger } from "../utils/logger";

export type MiddlewareContext = {
  auth?: AuthContext;
};

export type RouteHandler = (
  request: Request,
  env: Env,
  ctx: MiddlewareContext,
) => Promise<Response>;

export type Middleware = (
  request: Request,
  env: Env,
  ctx: MiddlewareContext,
  next: () => Promise<Response>,
) => Promise<Response>;

export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request, env, ctx) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Missing or invalid Authorization header");
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    const token = authHeader.slice(7);
    ctx.auth = await verifySupabaseToken(env, token);

    return handler(request, env, ctx);
  };
}
