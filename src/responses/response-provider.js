class Response extends Error {
  constructor(message, statusCode) {
    super(message || "Internal server error");
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { Response };
