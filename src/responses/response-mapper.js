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
  if (!statusCode || !errorMap[statusCode]) {
    return new InternalServerError(message);
  }
  const Response = errorMap[statusCode];
  return new Response(message);
};

export { getResponse };
