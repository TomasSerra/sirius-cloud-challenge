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

export function setupFileController() {
  const fileRepository = new FileRepository();
  const shareRepository = new ShareRepository();
  const dailyStorageRepository = new DailyStorageRepository();
  const userRepository = new UserRepository();
  const storageManager = new StorageManager();
  const transactionalManager = new TransactionManager();

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
    resolveError,
  });

  return fileController;
}
