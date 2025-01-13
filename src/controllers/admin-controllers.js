class AdminController {
  constructor({ adminService, resolveError, extractUserIdFromToken }) {
    this.adminService = adminService;
    this.resolveError = resolveError;
    this.extractUserId = extractUserIdFromToken;
    this.stats = this.stats.bind(this);
  }

  async stats(req, res) {
    try {
      const userId = await this.extractUserId(req).catch((error) => {
        return this.resolveError(error, res);
      });
      const result = await this.adminService.getStats(userId);

      return res.status(200).json({
        message: "Stats fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error during stats fetch:", error.message);
      return this.resolveError(error, res);
    }
  }
}

export default AdminController;
