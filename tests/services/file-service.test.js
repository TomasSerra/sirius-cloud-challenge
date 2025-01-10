import FileService from "../../src/services/file-service.js";
import { getResponse } from "../../src/responses/response-mapper.js";
import { extractUserIdFromToken } from "../../src/utils/decode-token.js";
import { hashFilename } from "../../src/utils/hash-filename.js";
import { jest, describe, beforeEach, it, expect } from "@jest/globals";

jest.mock("../../src/responses/response-mapper.js");
jest.mock("../../src/utils/decode-token.js");
jest.mock("../../src/utils/hash-filename.js");

describe("FileService", () => {
  let fileService;
  let mockStorageManager,
    mockFileRepository,
    mockDailyStorageRepository,
    mockTransactionalManager;

  beforeEach(() => {
    mockStorageManager = { uploadFile: jest.fn() };
    mockFileRepository = { create: jest.fn() };
    mockDailyStorageRepository = {
      findTotalMbUsedByMonth: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    mockTransactionalManager = { transaction: jest.fn() };

    fileService = new FileService({
      storageManager: mockStorageManager,
      fileRepository: mockFileRepository,
      dailyStorageRepository: mockDailyStorageRepository,
      transactionalManager: mockTransactionalManager,
    });

    jest.clearAllMocks();
  });

  it("should throw an error if userId or file is missing", async () => {
    extractUserIdFromToken.mockResolvedValue(null);

    const req = {};
    const file = null;

    await expect(fileService.upload(file, req)).rejects.toThrow(
      "userId and file are required"
    );

    expect(getResponse).toHaveBeenCalledWith(
      400,
      "userId and file are required"
    );
  });

  it("should throw an error if monthly storage limit is exceeded", async () => {
    extractUserIdFromToken.mockResolvedValue("user123");
    mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(6000);

    const req = {};
    const file = { size: 1024 ** 2, originalname: "testfile.txt" };

    await expect(fileService.upload(file, req)).rejects.toThrow(
      "Monthly storage limit exceeded, try again next month"
    );

    expect(getResponse).toHaveBeenCalledWith(
      403,
      "Monthly storage limit exceeded, try again next month"
    );
  });

  it("should upload file successfully", async () => {
    extractUserIdFromToken.mockResolvedValue("user123");
    mockDailyStorageRepository.findTotalMbUsedByMonth.mockResolvedValue(1000);
    mockTransactionalManager.transaction.mockImplementation(async (callback) =>
      callback()
    );
    mockStorageManager.uploadFile.mockResolvedValue("file-upload-result");
    hashFilename.mockReturnValue("hashed-filename");

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
