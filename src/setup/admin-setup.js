import { DailyStorageRepository } from "../repositories/daily-storage-repository.js";
import { UserRepository } from "../repositories/user-repository.js";
import AdminService from "../services/admin-services.js";
import AdminController from "../controllers/admin-controllers.js";
import { resolveError } from "../responses/response-handler.js";

export function setupAdminController() {
  const dailyStorageRepository = new DailyStorageRepository();
  const userRepository = new UserRepository();

  const adminService = new AdminService({
    dailyStorageRepository,
    userRepository,
  });

  const adminController = new AdminController({
    adminService,
    resolveError,
  });

  return adminController;
}
