import { Response } from "./response-provider.js";

const getResponse = (statusCode, message) => {
  if (typeof statusCode !== "number") {
    statusCode = 500;
  }
  return new Response(statusCode, message);
};

export { getResponse };
