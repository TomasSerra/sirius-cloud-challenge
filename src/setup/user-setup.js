import { UserRepository } from "../repositories/user-repository.js";
import UserService from "../services/user-service.js";
import UserController from "../controllers/user-controllers.js";
import { resolveError } from "../responses/response-handler.js";

export function setupUserController() {
  const userRepository = new UserRepository();

  const userService = new UserService({
    userRepository,
  });

  const userController = new UserController({
    userService,
    resolveError,
  });

  return userController;
}
