import { getResponse } from "../responses/response-mapper.js";

class UserService {
  constructor({ userRepository, authManager }) {
    this.userRepository = userRepository;
    this.authManager = authManager;
  }

  async register(email, password) {
    try {
      const response = await this.authManager.register(email, password);
      await this.#createNewUserInDb(response);
      return response.data;
    } catch (error) {
      this.#resolveError(error, "An error occurred during registration");
    }
  }

  async login(email, password) {
    try {
      const response = await this.authManager.login(email, password);
      return response.data;
    } catch (error) {
      this.#resolveError(error, "An error occurred during login");
    }
  }

  async #createNewUserInDb(response) {
    const userId = response.data.identities[0].user_id;
    await this.userRepository.create(userId, false);
  }

  #resolveError(error, message) {
    if (error.response) {
      const { status, data } = error.response;
      throw getResponse(
        status || data?.statusCode,
        data?.message || data?.error_description || message
      );
    } else {
      throw getResponse(500, message);
    }
  }
}

export default UserService;
