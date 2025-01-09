import { getResponse } from "../responses/response-mapper.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";
import { hashFilename } from "../utils/hash-filename.js";

class FileService {
  constructor({
    storageManager,
    fileRepository,
    shareRepository,
    dailyStorageRepository,
    userRepository,
  }) {
    this.storageManager = storageManager;
    this.fileRepository = fileRepository;
    this.shareRepository = shareRepository;
    this.dailyStorageRepository = dailyStorageRepository;
    this.userRepository = userRepository;
  }

  async upload(file, req) {
    const userId = await extractUserIdFromToken(req);
    if (!userId || !file) {
      throw getResponse(400, "userId and file are required");
    }
    const limitExceeded = await this.#isMonthlyStorageLimitExceeded(userId);
    if (limitExceeded) {
      throw getResponse(403, "Monthly storage limit exceeded");
    }
    try {
      const originalFilename = file.originalname;
      const hashedFilename = hashFilename(originalFilename);
      const response = await this.storageManager.uploadFile(
        file,
        hashedFilename,
        userId
      );
      const mbUsed = file.size / 1024 ** 2;
      await this.#createOrUpdateDailyStorage(userId, mbUsed);
      await this.#createFileInDb(
        userId,
        hashedFilename,
        originalFilename,
        mbUsed
      );
      return response;
    } catch (error) {
      this.resolveError(error, "An error occurred uploading the file");
    }
  }

  async download(fileId, req) {
    const userId = await extractUserIdFromToken(req);
    const file = await this.#getOwnOrSharedFile(fileId, userId);
    const cloudFilename = file.cloudFileName;
    const ownerUserId = file.userId;

    if (!userId || !fileId) {
      throw getResponse(400, "userId and fileId are required");
    }
    return await this.storageManager.downloadFile(cloudFilename, ownerUserId);
  }

  async share(toUserId, fileId, req) {
    const userId = await extractUserIdFromToken(req);
    if (!userId || !fileId || !toUserId) {
      throw getResponse(400, "userId, filename, and toUserId are required");
    }
    await this.#checkCanShareFile(fileId, userId, toUserId);
    await this.#createShareInDb(fileId, userId, toUserId);
  }

  async #createShareInDb(fileId, userId, toUserId) {
    await this.shareRepository.create(userId, toUserId, fileId);
  }

  async #getOwnOrSharedFile(fileId, userId) {
    let file = await this.fileRepository.findByFileId(fileId);
    if (!file) {
      throw getResponse(404, "File not found");
    }
    if (file.userId !== userId) {
      const isFileShared = (await this.#getSharedFile(fileId, userId)) !== null;
      if (!isFileShared) {
        throw getResponse(403, "You are not authorized to view this file");
      }
    }
    return file;
  }

  async #isMonthlyStorageLimitExceeded(userId) {
    const monthLimit = 5120; // 5 GB
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");

    const mbUsedThisMonth =
      await this.dailyStorageRepository.findTotalMbUsedByMonth(
        userId,
        year,
        month
      );

    return mbUsedThisMonth > monthLimit;
  }

  async #checkCanShareFile(fileId, userId, toUserId) {
    let file;
    try {
      file = await this.fileRepository.findByFileId(fileId);
    } catch {
      throw getResponse(500, "An error occurred sharing the file");
    }
    if (!file) {
      throw getResponse(404, "File not found");
    }
    if (file.userId !== userId) {
      throw getResponse(403, "You are not authorized to share this file");
    }
    if (file.userId === toUserId) {
      throw getResponse(400, "You cannot share a file with yourself");
    }
    const user = await this.userRepository.findByUserId(toUserId);
    if (!user) {
      throw getResponse(404, `User ${toUserId} not found`);
    }
  }

  async #getSharedFile(fileId, userId) {
    return await this.shareRepository.findByFileIdAndToUserId(fileId, userId);
  }

  async #createOrUpdateDailyStorage(userId, mbUsed) {
    const today = new Date().toISOString().split("T")[0];

    const existingRecord =
      await this.dailyStorageRepository.findByUserIdAndDate(userId, today);

    if (existingRecord) {
      const updatedMbUsed = existingRecord.mbUsed + mbUsed;
      return this.dailyStorageRepository.update(userId, today, updatedMbUsed);
    } else {
      return this.dailyStorageRepository.create({
        userId,
        date: today,
        mbUsed,
      });
    }
  }

  async #createFileInDb(userId, hashedFilename, originalFilename, mbUsed) {
    return this.fileRepository.create(
      userId,
      hashedFilename,
      originalFilename,
      mbUsed
    );
  }

  resolveError(error, message) {
    console.error(message, error);
    if (error.response) {
      const { status, data } = error.response;
      throw getResponse(status, data?.message || message);
    } else {
      throw getResponse(500, message);
    }
  }
}

export default FileService;
