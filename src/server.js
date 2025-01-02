import app from "./index.js";
import {
  notFoundHandler,
  generalErrorHandler,
  unauthorizedErrorHandler,
} from "./error-handler.js";

import userRoutes from "./routes/user-routes.js";

const PORT = 8081;

app.use("/api/auth", userRoutes);

app.use(unauthorizedErrorHandler);
app.use(notFoundHandler);
app.use(generalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
