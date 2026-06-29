export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Authentication required.",
  FORBIDDEN: "Insufficient permissions.",
  BAD_REQUEST: "Invalid request.",
  VALIDATION_ERROR: "Request validation failed.",
  INTERNAL_ERROR: "An unexpected error occurred.",
  NOT_FOUND: "Resource not found.",
  METHOD_NOT_ALLOWED: "Method not allowed.",
};

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const UPLOAD_PATHS = {
  games: "games",
  players: "players",
  teams: "teams",
} as const;
