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
      console.error("Error registering user:", error.message);
      const { status, data } = error.response;
      throw getResponse(
        status,
        data?.message || "An error occurred during registration"
      );
    }
  }

  async login(email, password) {
    try {
      const response = await this.authManager.login(email, password);
      return response.data;
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      const { status, data } = error.response;
      throw getResponse(
        status,
        data?.message || "An error occurred during logging"
      );
    }
  }

  async #createNewUserInDb(response) {
    const userId = response.data.identities[0].user_id;
    await this.userRepository.create(userId, false);
  }
}

export default UserService;
