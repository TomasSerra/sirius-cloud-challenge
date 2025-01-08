import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
} from "./http-responses.js";

const errorMap = {
  401: UnauthorizedError,
  403: ForbiddenError,
  404: NotFoundError,
  409: ConflictError,
  500: InternalServerError,
  503: ServiceUnavailableError,
};

const getResponse = (statusCode, message) => {
  if (typeof statusCode !== "number" || !errorMap[statusCode]) {
    statusCode = 500;
  }
  const ErrorResponse = errorMap[statusCode];
  return new ErrorResponse(message);
};

export { getResponse };
