export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR", errors);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    const message = id ? `${entity} with ID ${id} not found` : `${entity} not found`;
    super(message, "NOT_FOUND_ERROR");
    this.name = "NotFoundError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "DATABASE_ERROR", details);
    this.name = "DatabaseError";
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR");
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR");
}

export function getUserFriendlyMessage(error: AppError): string {
  const messages: Record<string, string> = {
    AUTHENTICATION_ERROR: "Debes iniciar sesión para continuar",
    AUTHORIZATION_ERROR: "No tienes permisos para realizar esta acción",
    VALIDATION_ERROR: "Por favor verifica los datos ingresados",
    NOT_FOUND_ERROR: "El recurso solicitado no fue encontrado",
    DATABASE_ERROR: "Error al acceder a la base de datos",
    UNKNOWN_ERROR: "Ocurrió un error inesperado",
  };

  return messages[error.code] || messages.UNKNOWN_ERROR;
}
