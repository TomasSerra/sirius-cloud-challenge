import multer from "multer";

const maxFileSize = 100 * 1024 * 1024; // 100 MB

const uploadConfig = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize },
}).single("file");

class FileController {
  constructor({ fileService, resolveError, extractUserIdFromToken }) {
    this.fileService = fileService;
    this.resolveError = resolveError;
    this.extractUserId = extractUserIdFromToken;

    this.upload = this.upload.bind(this);
    this.download = this.download.bind(this);
    this.share = this.share.bind(this);
  }

  async upload(req, res) {
    try {
      await new Promise((resolve, reject) => {
        uploadConfig(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const file = req.file;

      const userId = await this.extractUserId(req).catch((error) => {
        return this.resolveError(error, res);
      });

      await this.fileService.upload(file, userId);

      return res.status(200).send("File uploaded successfully");
    } catch (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).send(`File size exceeds the limit`);
      }
      console.error("Error during file upload:", err.message);
      return this.resolveError(err, res);
    }
  }

  async download(req, res) {
    try {
      const { fileId } = req.params;

      const userId = await this.extractUserId(req).catch((error) => {
        return this.resolveError(error, res);
      });

      const fileUrl = await this.fileService.download(fileId, userId);

      if (!fileUrl) {
        return res.status(404).send("File not found");
      }

      return res.status(200).send(fileUrl);
    } catch (error) {
      console.error("Error during file download:", error.message);
      return this.resolveError(error, res);
    }
  }

  async share(req, res) {
    try {
      const { fileId } = req.params;
      const { toUserId } = req.query;

      const userId = await this.extractUserId(req).catch((error) => {
        return this.resolveError(error, res);
      });

      await this.fileService.share(toUserId, fileId, userId);

      return res.status(200).send("File shared successfully");
    } catch (error) {
      console.error("Error during file sharing:", error.message);
      return this.resolveError(error, res);
    }
  }
}

export default FileController;
