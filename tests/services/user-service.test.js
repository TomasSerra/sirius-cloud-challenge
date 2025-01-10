import UserService from "../../src/services/user-service.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("UserService", () => {
  let userRepositoryMock;
  let authManagerMock;
  let userService;

  beforeEach(() => {
    userRepositoryMock = {
      create: jest.fn(),
    };
    authManagerMock = {
      register: jest.fn(),
      login: jest.fn(),
    };
    userService = new UserService({
      userRepository: userRepositoryMock,
      authManager: authManagerMock,
    });
  });

  describe("register", () => {
    it("should register a new user and create a user in the database", async () => {
      const email = "test@example.com";
      const password = "securepassword";
      const authResponse = {
        data: {
          identities: [{ user_id: "user-123" }],
        },
      };

      authManagerMock.register.mockResolvedValue(authResponse);

      const result = await userService.register(email, password);

      expect(authManagerMock.register).toHaveBeenCalledWith(email, password);
      expect(userRepositoryMock.create).toHaveBeenCalledWith("user-123", false);
      expect(result).toEqual(authResponse.data);
    });

    it("should throw an error if registration fails", async () => {
      const email = "test@example.com";
      const password = "pass";
      const error = {
        response: {
          status: 401,
          data: {
            message: "Invalid email or password",
            code: "AUTH_INVALID_CREDENTIALS",
            details: {
              attemptsRemaining: 3,
            },
          },
        },
      };

      authManagerMock.register.mockRejectedValue(error);

      await expect(userService.register(email, password)).rejects.toMatchObject(
        {
          statusCode: 401,
          message: "Invalid email or password",
        }
      );

      expect(authManagerMock.register).toHaveBeenCalledWith(email, password);
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should log in a user and return the response data", async () => {
      const email = "test@example.com";
      const password = "securepassword";
      const authResponse = {
        data: {
          token: "fake-jwt-token",
        },
      };

      authManagerMock.login.mockResolvedValue(authResponse);

      const result = await userService.login(email, password);

      expect(authManagerMock.login).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(authResponse.data);
    });

    it("should throw an error if login fails", async () => {
      const email = "test@example.com";
      const password = "securepassword";
      const error = {
        response: {
          status: 401,
          data: {
            message: "Invalid email or password",
            code: "AUTH_INVALID_CREDENTIALS",
            details: {
              attemptsRemaining: 3,
            },
          },
        },
      };

      authManagerMock.login.mockRejectedValue(error);

      await expect(userService.login(email, password)).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid email or password",
      });

      expect(authManagerMock.login).toHaveBeenCalledWith(email, password);
    });
  });
});
