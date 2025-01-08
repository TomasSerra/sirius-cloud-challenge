import express from "express";
import { middlewareJwtCheck } from "./config/auth.js";

import userRoutes from "./routes/user-routes.js";
import fileManagerRoutes from "./routes/file-manager-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import { responseHandler } from "./responses/response-handler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//No authentication routes
app.use("/api/auth", userRoutes);

//Authenticaton routes
app.use(middlewareJwtCheck);
app.use("/api/file", fileManagerRoutes);
app.use("/api/admin", adminRoutes);

//Responses
app.use(responseHandler);

export default app;
