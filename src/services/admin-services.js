import { getResponse } from "../responses/response-mapper.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";

class AdminService {
  constructor({ dailyStorageRepository, userRepository }) {
    this.dailyStorageRepository = dailyStorageRepository;
    this.userRepository = userRepository;
  }

  async getStats(req) {
    const userId = await extractUserIdFromToken(req).catch((error) => {
      throw getResponse(400, error.message);
    });
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
