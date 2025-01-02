const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: "Not found" });
};

const generalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
};

const unauthorizedErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or missing token" });
  }
  next(err);
};

export { notFoundHandler, generalErrorHandler, unauthorizedErrorHandler };
