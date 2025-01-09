import { getResponse } from "../responses/response-mapper.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";
import { hashFilename } from "../utils/hash-filename.js";
import { StorageManager } from "../storage/storage-manager.js";
import { ShareRepository } from "../repositories/share-repository.js";
import { FileRepository } from "../repositories/file-repository.js";
import { DailyStorageRepository } from "../repositories/daily-storage-repository.js";
import { UserRepository } from "../repositories/user-repository.js";

const uploadFile = async (file, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !file) {
    throw getResponse(400, "userId and file are required");
  }
  const limitExceeded = await isMonthlyStorageLimitExceeded(userId);
  if (limitExceeded) {
    throw getResponse(403, "Monthly storage limit exceeded");
  }
  const sp = new StorageManager();
  try {
    const originalFilename = file.originalname;
    const hashedFilename = hashFilename(originalFilename);
    const response = await sp.uploadFile(file, hashedFilename, userId);
    const mbUsed = file.size / 1024 ** 2;
    await createOrUpdateDailyStorage(userId, mbUsed);
    await createFileInDb(userId, hashedFilename, originalFilename, mbUsed);
    return response;
  } catch (error) {
    resolveError(error, "An error occurred uploading the file");
  }
};

const downloadFile = async (fileId, req) => {
  const userId = await extractUserIdFromToken(req);
  const file = await getOwnOrSharedFile(fileId, userId);
  const cloudFilename = file.cloudFileName;
  const ownerUserId = file.userId;

  if (!userId || !fileId) {
    throw getResponse(400, "userId and fileId are required");
  }
  const sp = new StorageManager();

  return await sp.downloadFile(cloudFilename, ownerUserId);
};

const shareFile = async (toUserId, fileId, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !fileId || !toUserId) {
    throw getResponse(400, "userId, filename, and toUserId are required");
  }
  await checkCanShareFile(fileId, userId, toUserId);
  await createShareInDb(fileId, userId, toUserId);
};

async function createShareInDb(fileId, userId, toUserId) {
  const shareRepository = new ShareRepository();
  await shareRepository.create(userId, toUserId, fileId);
}

async function getOwnOrSharedFile(fileId, userId) {
  const fileRepository = new FileRepository();
  let file = await fileRepository.findByFileId(fileId);
  if (!file) {
    throw getResponse(404, "File not found");
  }
  if (file.userId !== userId) {
    const isFileShared = (await getSharedFile(fileId, userId)) !== null;
    if (!isFileShared) {
      throw getResponse(403, "You are not authorized to view this file");
    }
  }
  return file;
}

async function isMonthlyStorageLimitExceeded(userId) {
  const monthLimit = 5120; // 5 GB
  const dailyStorageRepository = new DailyStorageRepository();
  const today = new Date().toISOString().split("T")[0];
  const month = today.split("-").slice(0, 2).join("-");
  const year = today.split("-")[0];
  const mbUsedThisMonth = await dailyStorageRepository.findTotalMbUsedByMonth(
    userId,
    year,
    month
  );
  console.log(mbUsedThisMonth);
  return mbUsedThisMonth > monthLimit;
}

async function checkCanShareFile(fileId, userId, toUserId) {
  const fileRepository = new FileRepository();
  const file = await fileRepository.findByFileId(fileId);
  if (!file) {
    throw getResponse(404, "File not found");
  }
  if (file.userId !== userId) {
    throw getResponse(403, "You are not authorized to share this file");
  }
  if (file.userId === toUserId) {
    throw getResponse(400, "You cannot share a file with yourself");
  }
  const userRepositoy = new UserRepository();
  const user = await userRepositoy.findByUserId(toUserId);
  if (!user) {
    throw getResponse(404, `User ${toUserId} not found`);
  }
}

async function getSharedFile(fileId, userId) {
  const shareRepository = new ShareRepository();
  const sharedFile = await shareRepository.findByFileIdAndToUserId(
    fileId,
    userId
  );
  return sharedFile;
}

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

async function createFileInDb(
  userId,
  hashedFilename,
  originalFilename,
  mbUsed
) {
  const fileRepository = new FileRepository();
  return fileRepository.create(
    userId,
    hashedFilename,
    originalFilename,
    mbUsed
  );
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
