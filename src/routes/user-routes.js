import express from "express";
import { setupUserController } from "../setup/user-setup.js";

const userRoutes = express.Router();
const userController = setupUserController();

userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);

export default userRoutes;
