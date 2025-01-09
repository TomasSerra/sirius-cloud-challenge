import express from "express";
import { setupFileController } from "../setup/file-manager-setup.js";

const fileManagerRoutes = express.Router();
const fileController = setupFileController();

fileManagerRoutes.post("/upload", fileController.upload);
fileManagerRoutes.post("/share/:fileId", fileController.share);
fileManagerRoutes.get("/download/:fileId", fileController.download);

export default fileManagerRoutes;
