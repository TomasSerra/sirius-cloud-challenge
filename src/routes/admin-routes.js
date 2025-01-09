import express from "express";
import { setupAdminController } from "../setup/admin-setup.js";

const adminRoutes = express.Router();
const adminController = setupAdminController();

adminRoutes.get("/stats", adminController.stats);

export default adminRoutes;
