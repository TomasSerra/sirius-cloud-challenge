import express from "express";
import {
  upload,
  download,
  share,
} from "../controllers/file-manager-controllers.js";

const fileManagerRoutes = express.Router();

fileManagerRoutes.post("/upload", upload);
fileManagerRoutes.get("/download/:filename", download);
fileManagerRoutes.post("/share", share);

export default fileManagerRoutes;
