import { Response } from "./response-provider.js";

const resolveError = (error, res) => {
  if (error instanceof Response) {
    return res.status(error.statusCode).send(error.message);
  }
  if (res.status) {
    console.log(res.statusCode);
    return res
      .status(res.statusCode != 200 ? res.statusCode : 500)
      .send(res.message);
  }

  return res.status(500).send("An internal server error occurred");
};

export { resolveError };
