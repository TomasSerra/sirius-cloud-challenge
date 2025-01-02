import express from "express";
import { jwtCheck } from "./config/auth.js";

const app = express();

app.use(express.json());
//app.use(jwtCheck);

export default app;
