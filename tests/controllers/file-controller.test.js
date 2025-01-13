import express from "express";
import request from "supertest";
import FileController from "../../src/controllers/file-manager-controllers.js";
import { describe, expect, it, jest, afterEach } from "@jest/globals";
import { resolveError } from "../../src/responses/response-handler.js";

const mockFileService = {
  upload: jest.fn(),
  download: jest.fn(),
  share: jest.fn(),
};

const mockExtractUserIdFromToken = jest.fn();

const app = express();
const fileController = new FileController({
  fileService: mockFileService,
  resolveError: resolveError,
  extractUserIdFromToken: mockExtractUserIdFromToken,
});

app.post("/upload", fileController.upload);
app.get("/download/:fileId", fileController.download);
app.post("/share/:fileId", fileController.share);

describe("FileController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("upload", () => {
    it("should upload a file successfully", async () => {
      const mockFile = Buffer.from("test file content");
      const file = {
        originalname: "test.txt",
        buffer: mockFile,
        mimetype: "text/plain",
        size: mockFile.length,
        encoding: "7bit",
        fieldname: "file",
      };
      const userId = "fh2j345b6j35";
      mockExtractUserIdFromToken.mockResolvedValue(userId);
      mockFileService.upload.mockResolvedValue({
        url: "http://example.com/test.txt",
      });

      const response = await request(app)
        .post("/upload")
        .attach("file", mockFile, "test.txt");

      expect(response.status).toBe(200);
      expect(response.text).toBe("File uploaded successfully");
      expect(mockFileService.upload).toHaveBeenCalledWith(file, userId);
    });

    it("should return 413 if file size exceeds limit", async () => {
      const largeFile = Buffer.alloc(101 * 1024 * 1024); // 101 MB

      const response = await request(app)
        .post("/upload")
        .attach("file", largeFile, "large.txt");

      expect(response.status).toBe(413);
      expect(response.text).toBe("File size exceeds the limit");
    });
  });

  describe("download", () => {
    it("should download a file successfully", async () => {
      const fileId = "123";
      mockFileService.download.mockResolvedValue("http://example.com/test.txt");
      const userId = "fh2j345b6j35";
      mockExtractUserIdFromToken.mockResolvedValue(userId);

      const response = await request(app).get(`/download/${fileId}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("http://example.com/test.txt");
      expect(mockFileService.download).toHaveBeenCalledWith(fileId, userId);
    });

    it("should return 404 if file not found", async () => {
      const fileId = "123";
      mockFileService.download.mockResolvedValue(null);
      const userId = "fh2j345b6j35";
      mockExtractUserIdFromToken.mockResolvedValue(userId);

      const response = await request(app).get(`/download/${fileId}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe("File not found");
    });
  });

  describe("share", () => {
    it("should share a file successfully", async () => {
      const fileId = "123";
      const toUserId = "456";
      const userId = "fh2j345b6j35";
      mockExtractUserIdFromToken.mockResolvedValue(userId);
      mockFileService.share.mockResolvedValue();

      const response = await request(app).post(
        `/share/${fileId}?toUserId=${toUserId}`
      );

      expect(response.status).toBe(200);
      expect(response.text).toBe("File shared successfully");

      expect(mockFileService.share).toHaveBeenCalledWith(
        toUserId,
        fileId,
        userId
      );
    });
  });
});
