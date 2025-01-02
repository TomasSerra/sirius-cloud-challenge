import express from "express";
import { jwtCheck } from "./config/auth.js";
import {
  notFoundHandler,
  generalErrorHandler,
  unauthorizedErrorHandler,
} from "./error-handler.js";

import userRoutes from "./routes/user-routes.js";

const app = express();

app.use(express.json());

//No authentication routes
app.use("/api/auth", userRoutes);

//Authenticaton routes
app.use(jwtCheck);

//Errors
app.use(unauthorizedErrorHandler);
app.use(notFoundHandler);
app.use(generalErrorHandler);

export default app;
