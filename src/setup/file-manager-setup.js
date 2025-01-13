import FileService from "../services/file-service.js";
import FileController from "../controllers/file-manager-controllers.js";
import { FileRepository } from "../repositories/file-repository.js";
import { ShareRepository } from "../repositories/share-repository.js";
import { DailyStorageRepository } from "../repositories/daily-storage-repository.js";
import { UserRepository } from "../repositories/user-repository.js";
import { StorageManager } from "../storage/storage-manager.js";
import { resolveError } from "../responses/response-handler.js";
import { TransactionManager } from "../repositories/transactional-manager.js";
import { hashFilename } from "../utils/hash-filename.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";
import { AzureStorageProvider } from "../storage/providers/ab-storage-provider.js";
import { GCSStorageProvider } from "../storage/providers/gc-storage-provider.js";

export function setupFileController() {
  const fileRepository = new FileRepository();
  const shareRepository = new ShareRepository();
  const dailyStorageRepository = new DailyStorageRepository();
  const userRepository = new UserRepository();
  const transactionalManager = new TransactionManager();
  const providers = [new AzureStorageProvider(), new GCSStorageProvider()];
  const storageManager = new StorageManager({ providers });

  const fileService = new FileService({
    fileRepository,
    shareRepository,
    dailyStorageRepository,
    userRepository,
    storageManager,
    transactionalManager,
    hashFilename,
  });

  const fileController = new FileController({
    fileService,
    extractUserIdFromToken,
    resolveError,
  });

  return fileController;
}
