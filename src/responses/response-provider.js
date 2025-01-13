class Response extends Error {
  constructor(statusCode, message) {
    super(message || "Internal server error");
    this.statusCode = statusCode || 500;
  }
}

export { Response };
