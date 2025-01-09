import express from "express";
import request from "supertest";
import UserController from "../../src/controllers/user-controllers.js";
import { describe, expect, it, jest, afterEach } from "@jest/globals";
import { resolveError } from "../../src/responses/response-handler.js";

const mockUserService = {
  register: jest.fn(),
  login: jest.fn(),
};

const app = express();
app.use(express.json());

const userController = new UserController({
  userService: mockUserService,
  resolveError: resolveError,
});

app.post("/register", userController.register);
app.post("/login", userController.login);

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      const mockUserData = {
        email: "test@example.com",
        password: "password123",
      };

      mockUserService.register.mockResolvedValue({
        id: "1",
        email: mockUserData.email,
      });

      const response = await request(app).post("/register").send(mockUserData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User registered successfully");
      expect(mockUserService.register).toHaveBeenCalledWith(
        mockUserData.email,
        mockUserData.password
      );
    });

    it("should return error if registration fails", async () => {
      const mockUserData = {
        email: "test@example.com",
        password: "password123",
      };

      mockUserService.register.mockRejectedValue(
        new Error("Registration failed")
      );

      const response = await request(app).post("/register").send(mockUserData);

      expect(response.status).toBe(500);
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      const mockUserData = {
        email: "test@example.com",
        password: "password123",
      };

      mockUserService.login.mockResolvedValue({
        id: "1",
        email: mockUserData.email,
      });

      const response = await request(app).post("/login").send(mockUserData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(mockUserService.login).toHaveBeenCalledWith(
        mockUserData.email,
        mockUserData.password
      );
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: "", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email and password are required");
    });

    it("should return error if login fails", async () => {
      const mockUserData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      mockUserService.login.mockRejectedValue(new Error("Login failed"));

      const response = await request(app).post("/login").send(mockUserData);

      expect(response.status).toBe(500);
    });
  });
});
