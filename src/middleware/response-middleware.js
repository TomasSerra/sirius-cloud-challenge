import { Response } from "../responses/response-provider.js";

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

export { responseHandler };
