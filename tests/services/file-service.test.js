import FileService from "../../src/services/file-service.js";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import { StorageManager } from "../../src/storage/storage-manager.js";

describe("FileService", () => {
  let fileService;
  let mockStorageManager,
    mockFileRepository,
    mockDailyStorageRepository,
    mockTransactionalManager,
    mockExtractUserIdFromToken,
    mockHashFilename,
    mockProviders,
    mockShareRepository,
    mockUserRepository;

  beforeEach(() => {
    mockProviders = [
      { upload: jest.fn(), download: jest.fn() },
      { upload: jest.fn(), download: jest.fn() },
    ];
    mockStorageManager = new StorageManager({ providers: mockProviders });
    mockFileRepository = { create: jest.fn(), findByFileId: jest.fn() };
    mockShareRepository = {
      create: jest.fn(),
      findByFileIdAndToUserId: jest.fn(),
    };
    mockUserRepository = {
      findByUserId: jest.fn(),
    };
    mockDailyStorageRepository = {
      findTotalMbUsedByMonth: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findByUserIdAndDate: jest.fn(),
    };
    mockTransactionalManager = { transaction: jest.fn() };
    mockExtractUserIdFromToken = jest.fn().mockResolvedValue("user123");
    mockHashFilename = jest.fn().mockReturnValue("hashed-filename");

    fileService = new FileService({
      storageManager: mockStorageManager,
      fileRepository: mockFileRepository,
      shareRepository: mockShareRepository,
      userRepository: mockUserRepository,
      dailyStorageRepository: mockDailyStorageRepository,
      transactionalManager: mockTransactionalManager,
      extractUserIdFromToken: mockExtractUserIdFromToken,
      hashFilename: mockHashFilename,
    });

    jest.clearAllMocks();
  });

  describe("upload file", () => {
    it("should throw an error if userId or file is missing", async () => {
      const req = {};
      const file = null;

      await expect(fileService.upload(file, req)).rejects.toThrow(
        "userId and file are required"
      );
    });

    it("should throw an error if monthly storage limit is exceeded", async () => {
      mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(6000);

      const req = {};
      const file = { size: 1024 ** 2, originalname: "testfile.txt" };

      await expect(fileService.upload(file, req)).rejects.toThrow(
        "Monthly storage limit exceeded, try again next month"
      );
    });

    it("should upload file successfully if both storage providers are ok", async () => {
      mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(1000);
      mockProviders[0].upload.mockResolvedValue();
      mockProviders[1].upload.mockResolvedValue();

      mockTransactionalManager.transaction.mockImplementation(
        async (callback) => callback()
      );

      const req = {};
      const file = { size: 1024 ** 2, originalname: "testfile.txt" };

      await fileService.upload(file, req);

      expect(mockProviders[0].upload).toHaveBeenCalledWith(
        file,
        "hashed-filename",
        "user123"
      );
      expect(mockProviders[1].upload).toHaveBeenCalledWith(
        file,
        "hashed-filename",
        "user123"
      );
      expect(mockTransactionalManager.transaction).toHaveBeenCalled();
    });

    it("should upload file successfully if at least one storage providers is ok", async () => {
      mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(1000);
      mockProviders[0].upload.mockRejectedValue(new Error("Upload failed"));
      mockProviders[1].upload.mockResolvedValue();

      mockTransactionalManager.transaction.mockImplementation(
        async (callback) => callback()
      );

      const req = {};
      const file = { size: 1024 ** 2, originalname: "testfile.txt" };

      await fileService.upload(file, req);

      expect(mockProviders[0].upload).toHaveBeenCalledWith(
        file,
        "hashed-filename",
        "user123"
      );
      expect(mockProviders[1].upload).toHaveBeenCalledWith(
        file,
        "hashed-filename",
        "user123"
      );
      expect(mockTransactionalManager.transaction).toHaveBeenCalled();
    });

    it("should throw an error if all storage providers fail", async () => {
      mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(1000);
      mockProviders[0].upload.mockRejectedValue(new Error("Upload failed"));
      mockProviders[1].upload.mockRejectedValue(new Error("Upload failed"));

      mockTransactionalManager.transaction.mockImplementation(
        async (callback) => callback()
      );

      const req = {};
      const file = { size: 1024 ** 2, originalname: "testfile.txt" };

      await expect(fileService.upload(file, req)).rejects.toThrow(
        "An error occurred uploading the file"
      );

      expect(mockProviders[0].upload).toHaveBeenCalledWith(
        file,
        "hashed-filename",
        "user123"
      );
      expect(mockProviders[1].upload).toHaveBeenCalledWith(
        file,
        "hashed-filename",
        "user123"
      );
      expect(mockTransactionalManager.transaction).toHaveBeenCalled();
    });
  });

  describe("download file", () => {
    it("should throw an error if the file is not found", async () => {
      mockFileRepository.findByFileId.mockResolvedValue(null);

      const req = {};
      const fileId = "file123";

      await expect(fileService.download(fileId, req)).rejects.toThrow(
        "File not found"
      );
    });

    it("should throw an error if the user is not authorized", async () => {
      mockFileRepository.findByFileId.mockResolvedValue({ userId: "owner123" });
      mockShareRepository.findByFileIdAndToUserId.mockResolvedValue(null);

      const req = {};
      const fileId = "file123";

      await expect(fileService.download(fileId, req)).rejects.toThrow(
        "You are not authorized to view this file"
      );
    });

    it("should download the file if user is authorized and one provider is ok", async () => {
      mockFileRepository.findByFileId.mockResolvedValue({
        userId: "user123",
        cloudFileName: "cloudFile",
      });
      mockProviders[0].download.mockResolvedValue("fileContent");

      const req = {};
      const fileId = "file123";

      const result = await fileService.download(fileId, req);

      expect(result).toBe("fileContent");
      expect(mockProviders[0].download).toHaveBeenCalledWith(
        "cloudFile",
        "user123"
      );
    });
  });

  describe("share file", () => {
    it("should throw an error if userId, fileId, or toUserId is missing", async () => {
      const req = {};
      const fileId = null;
      const toUserId = null;

      await expect(fileService.share(toUserId, fileId, req)).rejects.toThrow(
        "userId, filename, and toUserId are required"
      );
    });

    it("should throw an error if the file is not found", async () => {
      mockFileRepository.findByFileId.mockResolvedValue(null);

      const req = {};
      const fileId = "file123";
      const toUserId = "user456";

      await expect(fileService.share(toUserId, fileId, req)).rejects.toThrow(
        "File not found"
      );
    });

    it("should throw an error if the user is not authorized to share the file", async () => {
      mockFileRepository.findByFileId.mockResolvedValue({ userId: "owner123" });

      const req = {};
      const fileId = "file123";
      const toUserId = "user456";

      await expect(fileService.share(toUserId, fileId, req)).rejects.toThrow(
        "You are not authorized to share this file"
      );
    });

    it("should throw an error if the user tries to share the file with themselves", async () => {
      mockFileRepository.findByFileId.mockResolvedValue({ userId: "user123" });

      const req = {};
      const fileId = "file123";
      const toUserId = "user123";

      await expect(fileService.share(toUserId, fileId, req)).rejects.toThrow(
        "You cannot share a file with yourself"
      );
    });

    it("should throw an error if the target user does not exist", async () => {
      mockFileRepository.findByFileId.mockResolvedValue({ userId: "user123" });
      mockUserRepository.findByUserId.mockResolvedValue(null);

      const req = {};
      const fileId = "file123";
      const toUserId = "user456";

      await expect(fileService.share(toUserId, fileId, req)).rejects.toThrow(
        "User user456 not found"
      );
    });

    it("should share the file successfully", async () => {
      mockFileRepository.findByFileId.mockResolvedValue({ userId: "user123" });
      mockUserRepository.findByUserId.mockResolvedValue({ id: "user456" });
      mockShareRepository.create.mockResolvedValue();

      const req = {};
      const fileId = "file123";
      const toUserId = "user456";

      await fileService.share(toUserId, fileId, req);

      expect(mockShareRepository.create).toHaveBeenCalledWith(
        "user123",
        "user456",
        "file123"
      );
    });
  });
});
