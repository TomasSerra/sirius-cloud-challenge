import express from "express";
import { upload, download } from "../controllers/file-manager-controllers.js";

const fileManagerRoutes = express.Router();

fileManagerRoutes.post("/upload", upload);
fileManagerRoutes.post("/download", download);

export default fileManagerRoutes;
