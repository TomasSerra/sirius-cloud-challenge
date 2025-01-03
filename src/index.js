import express from "express";
import { jwtCheck } from "./config/auth.js";

import userRoutes from "./routes/user-routes.js";
import fileManagerRoutes from "./routes/file-manager-routes.js";
import { responseHandler } from "./responses/response-handler.js";

const app = express();

app.use(express.json());

//No authentication routes
app.use("/api/auth", userRoutes);

//Authenticaton routes
app.use(jwtCheck);
app.use("/api/file", fileManagerRoutes);

//Responses
app.use(responseHandler);

export default app;
