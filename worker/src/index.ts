import type { Env } from "./types";
import type { RouteHandler, MiddlewareContext } from "./middleware/auth";
import { withAuth } from "./middleware/auth";
import { requireCollaborator } from "./middleware/authorization";
import { uploadHandler } from "./routes/upload";
import { deleteHandler } from "./routes/delete";
import { AppError, createErrorResponse, getStatusCode, jsonResponse } from "./errors";
import { ERROR_CODES, ERROR_MESSAGES } from "./constants";
import { logger } from "./utils/logger";

type Route = {
  method: string;
  path: string;
  handler: RouteHandler;
};

const routes: Route[] = [
  {
    method: "POST",
    path: "/upload",
    handler: withAuth(requireCollaborator(uploadHandler)),
  },
  {
    method: "DELETE",
    path: "/upload",
    handler: withAuth(requireCollaborator(deleteHandler)),
  },
];

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const route = routes.find(
      (r) => r.method === request.method && r.path === url.pathname,
    );

    if (!route) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: ERROR_MESSAGES.NOT_FOUND,
          },
        }),
        { status: 404, headers: { ...corsHeaders(), "Content-Type": "application/json" } },
      );
    }

    const ctx: MiddlewareContext = {};

    try {
      const response = await route.handler(request, env, ctx);

      const headers = new Headers(response.headers);
      for (const [key, value] of Object.entries(corsHeaders())) {
        headers.set(key, value);
      }

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    } catch (error) {
      logger.error("Request failed", {
        path: url.pathname,
        method: request.method,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      const statusCode = getStatusCode(error);
      const errorResponse = createErrorResponse(error);

      return new Response(JSON.stringify(errorResponse), {
        status: statusCode,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      });
    }
  },
};
