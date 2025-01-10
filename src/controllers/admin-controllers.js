class AdminController {
  constructor({ adminService, resolveError }) {
    this.adminService = adminService;
    this.resolveError = resolveError;

    this.stats = this.stats.bind(this);
  }

  async stats(req, res) {
    try {
      const result = await this.adminService.getStats(req);

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
