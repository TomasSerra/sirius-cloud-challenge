import { getStats } from "../services/stats-services.js";
import { resolveError } from "../responses/response-handler.js";

const stats = async (req, res) => {
  try {
    const result = await getStats(req);

    return res.status(200).json({
      message: "Stats fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error during stats fetch:", error.message);
    return resolveError(error, res);
  }
};

export { stats };
