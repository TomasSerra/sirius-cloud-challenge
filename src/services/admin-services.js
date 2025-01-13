import { getResponse } from "../responses/response-mapper.js";

class AdminService {
  constructor({ dailyStorageRepository, userRepository }) {
    this.dailyStorageRepository = dailyStorageRepository;
    this.userRepository = userRepository;
  }

  async getStats(userId) {
    await this.#checkPermission(userId);
    return await this.dailyStorageRepository.findAllToday();
  }

  async #checkPermission(userId) {
    const isAdmin = (await this.userRepository.findByUserId(userId)).isAdmin;
    if (!isAdmin) {
      throw getResponse(403, "You are not authorized to view this data");
    }
  }
}

export default AdminService;
