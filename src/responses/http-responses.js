import { Response } from "./response-provider.js";

// 401 - Unauthorized
class UnauthorizedError extends Response {
  constructor(message) {
    super(message || "Unauthorized: Authentication is required", 401);
  }
}

// 403 - Forbidden
class ForbiddenError extends Response {
  constructor(message) {
    super(
      message ||
        "Forbidden: You do not have permission to access this resource",
      403
    );
  }
}

// 404 - Not Found
class NotFoundError extends Response {
  constructor(message) {
    super(message || "Not found", 404);
  }
}

// 409 - Conflict
class ConflictError extends Response {
  constructor(message) {
    super(message || "Conflict", 409);
  }
}

// 500 - Internal Server Error
class InternalServerError extends Response {
  constructor(message) {
    super(message || "Internal Server Error", 500);
  }
}

// 503 - Service Unavailable
class ServiceUnavailableError extends Response {
  constructor(message) {
    super(message || "Service Unavailable", 503);
  }
}

export {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
};
