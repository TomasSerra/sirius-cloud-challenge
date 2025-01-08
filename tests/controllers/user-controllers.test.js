import { describe, it, expect, beforeEach } from "@jest/globals";
import { jest } from "@jest/globals";
import { registerUser, loginUser } from "../../src/services/user-service.js";
import { register, login } from "../../src/controllers/user-controllers.js";

jest.mock("../../src/services/user-service.js", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      const mockResult = { id: 1, email: "test@example.com" };

      registerUser.mockResolvedValue(mockResult);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User  registered successfully",
        data: mockResult,
      });
    });

    it("should handle registration errors", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      const mockError = new Error("Registration failed");

      registerUser.mockRejectedValue(mockError);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "An error occurred during registration",
        error: mockError.message,
      });
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      const mockResult = { id: 1, email: "test@example.com" };

      loginUser.mockResolvedValue(mockResult);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        data: mockResult,
      });
    });

    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "test@example.com" };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    });

    it("should handle login errors", async () => {
      req.body = { email: "test@example.com", password: "password123" };

      loginUser.mockRejectedValueOnce(new Error("Login failed"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "An error occurred during login",
        error: "Login failed",
      });
    });
  });
});
