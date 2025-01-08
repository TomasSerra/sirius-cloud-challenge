import {
  uploadFile,
  downloadFile,
  shareFile,
} from "../services/file-service.js";
import { resolveError } from "../responses/response-handler.js";
import multer from "multer";

const maxFileSize = 100 * 1024 * 1024; //100mb

const uploadData = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
}).single("file");

const upload = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadData(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const file = req.file;

    const result = await uploadFile(file, req);

    return res.status(200).json({
      message: "File uploaded successfully",
      data: result,
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File size exceeds the limit" });
      }
    }
    console.error("Error during file upload:", err.message);
    return resolveError(err, res);
  }
};

const download = async (req, res) => {
  try {
    const { filename } = req.params;

    const fileUrl = await downloadFile(filename, req);

    if (!fileUrl) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).send(fileUrl);
  } catch (error) {
    console.error("Error during file download:", error.message);
    return resolveError(error, res);
  }
};

const share = async (req, res) => {
  try {
    const { filename } = req.params;
    const { toUserId } = req.query;

    await shareFile(toUserId, filename, req);

    return res.status(200).send("File shared successfully");
  } catch (error) {
    console.error("Error during file sharing:", error.message);
    return resolveError(error, res);
  }
};

export { upload, download, share };
