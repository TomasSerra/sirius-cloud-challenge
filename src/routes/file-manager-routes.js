import express from "express";
import {
  upload,
  download,
  share,
} from "../controllers/file-manager-controllers.js";

const fileManagerRoutes = express.Router();

fileManagerRoutes.post("/upload", upload);
fileManagerRoutes.post("/share/:filename", share);
fileManagerRoutes.get("/download/:filename", download);

export default fileManagerRoutes;
