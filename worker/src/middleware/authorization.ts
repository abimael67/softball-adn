import type { MiddlewareContext, RouteHandler } from "./auth";
import type { Env } from "../types";
import { AppError } from "../errors";
import { ERROR_CODES } from "../constants";

export function requireRoles(...roles: string[]): RouteHandler {
  return async (_request: Request, _env: Env, ctx: MiddlewareContext) => {
    if (!ctx.auth) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    const hasRole = ctx.auth.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    return new Response(null);
  };
}

export function requireAdmin(handler: RouteHandler): RouteHandler {
  return async (request, env, ctx) => {
    if (!ctx.auth) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    if (!ctx.auth.roles.includes("administrator")) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    return handler(request, env, ctx);
  };
}

export function requireCollaborator(handler: RouteHandler): RouteHandler {
  return async (request, env, ctx) => {
    if (!ctx.auth) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    const hasRole =
      ctx.auth.roles.includes("administrator") ||
      ctx.auth.roles.includes("collaborator");

    if (!hasRole) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 403);
    }

    return handler(request, env, ctx);
  };
}

export function requireAuthenticated(handler: RouteHandler): RouteHandler {
  return async (request, env, ctx) => {
    if (!ctx.auth) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
    }

    return handler(request, env, ctx);
  };
}
