import { getResponse } from "../responses/response-mapper.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";
import { StorageManager } from "../storage/storage-manager.js";
import { ShareRepository } from "../repositories/share-repository.js";
import { DailyStorageRepository } from "../repositories/daily-storage-repository.js";

const uploadFile = async (file, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !file) {
    throw getResponse(400, "userId and file are required");
  }
  const sp = new StorageManager();
  try {
    const response = await sp.uploadFile(file, userId);
    const mbUsed = file.size / 1024 ** 2;
    await createOrUpdateDailyStorage(userId, mbUsed);
    return response;
  } catch (error) {
    resolveError(error, "An error occurred uploading the file");
  }
};

const downloadFile = async (filename, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !filename) {
    throw getResponse(400, "userId and filename are required");
  }
  const sp = new StorageManager();
  try {
    return await sp.downloadFile(filename, userId);
  } catch (error) {
    resolveError(error, "An error occurred downloading the file");
  }
};

const shareFile = async (toUserId, filename, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !filename || !toUserId) {
    throw getResponse(400, "userId, filename, and toUserId are required");
  }
  const shareRepository = new ShareRepository();
  await shareRepository.create(userId, toUserId, filename);
};

async function createOrUpdateDailyStorage(userId, mbUsed) {
  const today = new Date().toISOString().split("T")[0];
  const dailyStorageRepository = new DailyStorageRepository();

  const existingRecord = await dailyStorageRepository.findByUserIdAndDate(
    userId,
    today
  );

  if (existingRecord) {
    const updatedMbUsed = existingRecord.mbUsed + mbUsed;
    return dailyStorageRepository.update(userId, today, updatedMbUsed);
  } else {
    return dailyStorageRepository.create({
      userId,
      date: today,
      mbUsed,
    });
  }
}

function resolveError(error, message) {
  console.error(message, error);
  // HTTP error
  if (error.response) {
    const { status, data } = error.response;
    throw getResponse(status, data?.message || message);
  } else {
    throw getResponse(500, message);
  }
}

export { uploadFile, downloadFile, shareFile };
