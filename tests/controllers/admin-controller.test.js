import express from "express";
import request from "supertest";
import AdminController from "../../src/controllers/admin-controllers.js";
import { describe, expect, it, jest, afterEach } from "@jest/globals";
import { resolveError } from "../../src/responses/response-handler.js";

const mockAdminService = {
  getStats: jest.fn(),
};

const mockExtractUserIdFromToken = jest.fn();

const app = express();
app.use(express.json());

const adminController = new AdminController({
  adminService: mockAdminService,
  resolveError,
  extractUserIdFromToken: mockExtractUserIdFromToken,
});

app.get("/stats", adminController.stats);

describe("AdminController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("stats", () => {
    it("should fetch stats successfully", async () => {
      const mockStatsData = [
        {
          userId: "fh2j345b6j35",
          mbUsed: 100.37,
        },
        {
          userId: "j53n56ni653on",
          mbUsed: 0.067213,
        },
      ];
      const userId = "fh2j345b6j35";
      mockExtractUserIdFromToken.mockResolvedValue(userId);
      mockAdminService.getStats.mockResolvedValue(mockStatsData);

      const response = await request(app).get("/stats");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Stats fetched successfully");
      expect(response.body.data).toEqual(mockStatsData);
      expect(mockAdminService.getStats).toHaveBeenCalledWith(userId);
    });

    it("should return error stats service fails", async () => {
      mockAdminService.getStats.mockRejectedValue(
        new Error("Failed to fetch stats")
      );
      const userId = "fh2j345b6j35";
      mockExtractUserIdFromToken.mockResolvedValue(userId);

      const response = await request(app).get("/stats");

      expect(response.status).toBe(500);
    });

    it("should return error if userId is missing", async () => {
      mockExtractUserIdFromToken.mockRejectedValue(
        new Error("Failed to extract userId")
      );

      const response = await request(app).get("/stats");

      expect(response.status).toBe(500);
    });
  });
});
