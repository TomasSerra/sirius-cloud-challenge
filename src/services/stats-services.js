import { DailyStorageRepository } from "../repositories/daily-storage-repository.js";
import { UserRepository } from "../repositories/user-repository.js";
import { getResponse } from "../responses/response-mapper.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";

const getStats = async (req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId) {
    throw getResponse(400, "userId is required");
  }
  checkPermission(userId);
  const dailyStorageRepository = new DailyStorageRepository();
  return await dailyStorageRepository.findAllToday();
};

async function checkPermission(userId) {
  const userRepository = new UserRepository();
  const isAdmin = (await userRepository.findByUserId(userId)).isAdmin;
  if (!isAdmin) {
    throw getResponse(403, "You are not authorized to view this data");
  }
}

export { getStats };
