import { Response } from "./response-provider.js";

const responseHandler = (res) => {
  let response = res;

  if (!(response instanceof Response)) {
    response = new Response(res.message || "Internal server error", 500);
  }

  res.status(response.statusCode).json({
    message: response.message,
  });
};

const resolveError = (error, res) => {
  if (error instanceof Response) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return res.status(500).json({
    message: "An internal server error occurred",
  });
};

export { responseHandler, resolveError };
