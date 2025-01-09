import { Response } from "./response-provider.js";

const responseHandler = (req, res, next) => {
  let response = res;

  if (!(response instanceof Response)) {
    res.status(500).send("An internal server error occurred");
  }

  if (res.status) {
    res.status(response.statusCode).send(response.message);
  } else {
    next();
  }
};

const resolveError = (error, res) => {
  if (error instanceof Response) {
    return res.status(error.statusCode).send(error.message);
  }
  if (res.status) {
    return res.status(res.statusCode).send(res.message);
  }

  return res.status(500).send("An internal server error occurred");
};

export { responseHandler, resolveError };
