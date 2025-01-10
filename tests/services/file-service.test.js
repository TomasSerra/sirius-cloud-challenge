jest.mock("../../src/utils/hash-filename.js");

import FileService from "../../src/services/file-service.js";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

describe("FileService", () => {
  let fileService;
  let mockStorageManager,
    mockFileRepository,
    mockDailyStorageRepository,
    mockTransactionalManager,
    mockExtractUserIdFromToken,
    mockHashFilename;

  beforeEach(() => {
    mockStorageManager = { uploadFile: jest.fn() };
    mockFileRepository = { create: jest.fn() };
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
      dailyStorageRepository: mockDailyStorageRepository,
      transactionalManager: mockTransactionalManager,
      extractUserIdFromToken: mockExtractUserIdFromToken,
      hashFilename: mockHashFilename,
    });

    jest.clearAllMocks();
  });

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

  it("should upload file successfully", async () => {
    mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(1000);
    mockTransactionalManager.transaction.mockImplementation(async (callback) =>
      callback()
    );
    mockStorageManager.uploadFile.mockResolvedValue("file-upload-result");

    const req = {};
    const file = { size: 1024 ** 2, originalname: "testfile.txt" };

    const result = await fileService.upload(file, req);

    expect(result).toBe("file-upload-result");
    expect(mockStorageManager.uploadFile).toHaveBeenCalledWith(
      file,
      "hashed-filename",
      "user123"
    );
    expect(mockTransactionalManager.transaction).toHaveBeenCalled();
  });
});
