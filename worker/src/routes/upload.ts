import type { RouteHandler, MiddlewareContext } from "../middleware/auth";
import type { Env, UploadResponse } from "../types";
import { AppError } from "../errors";
import { ERROR_CODES, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../constants";
import { createR2Service } from "../services/r2";
import { logger } from "../utils/logger";

function sanitizePath(path: string): string {
  return path
    .replace(/\.\./g, "")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
}

function generateKey(folder: string, extension: string): string {
  const uuid = crypto.randomUUID();
  return `${folder}/${uuid}.${extension}`;
}

function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
  };
  return map[contentType] || "bin";
}

export const uploadHandler: RouteHandler = async (
  request: Request,
  env: Env,
  ctx: MiddlewareContext,
): Promise<Response> => {
  const contentType = request.headers.get("Content-Type") || "";

  if (!contentType.includes("multipart/form-data")) {
    throw new AppError(ERROR_CODES.BAD_REQUEST, 400, "Expected multipart/form-data");
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const path = formData.get("path") as string | null;

  if (!file) {
    throw new AppError(ERROR_CODES.BAD_REQUEST, 400, "No file provided");
  }

  if (!path) {
    throw new AppError(ERROR_CODES.BAD_REQUEST, 400, "No path provided");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      400,
      `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      400,
      `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    );
  }

  const sanitizedPath = sanitizePath(path);
  const extension = getExtension(file.type);
  const key = generateKey(sanitizedPath, extension);

  const r2 = createR2Service(env);
  const buffer = await file.arrayBuffer();

  await r2.upload(key, new Uint8Array(buffer), file.type);

  logger.info("Upload successful", {
    key,
    userId: ctx.auth?.userId,
    size: file.size,
    contentType: file.type,
  });

  const responseData: UploadResponse = {
    key,
    contentType: file.type,
    size: file.size,
  };

  return new Response(JSON.stringify({ success: true, data: responseData }), {
    headers: { "Content-Type": "application/json" },
  });
};
