class Response extends Error {
  constructor(message, statusCode) {
    super(message || "Internal server error");
    this.statusCode = statusCode || 500;
  }
}

export { Response };
