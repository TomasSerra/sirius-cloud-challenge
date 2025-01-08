import axios from "axios";
import { getAuth0Token, authVariables } from "../config/auth.js";
import { getResponse } from "../responses/response-mapper.js";
import { UserRepository } from "../repositories/user-repository.js";

const registerUser = async (email, password) => {
  try {
    const accessToken = await getAuth0Token();

    const response = await axios.post(
      `https://${authVariables.authDomain}/api/v2/users`,
      {
        email,
        password,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    await createNewUserInDb(response);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    const { status, data } = error.response;
    throw getResponse(
      status,
      data?.message || "An error occurred during registration"
    );
  }
};

const loginUser = async (email, password) => {
  const accessToken = await getAuth0Token();

  try {
    const response = await axios.post(
      `https://${authVariables.authDomain}/oauth/token`,
      {
        grant_type: "password",
        username: email,
        password,
        client_id: authVariables.authClientId,
        client_secret: authVariables.authClientSecret,
        connection: "Username-Password-Authentication",
        audience: authVariables.authApiAudience,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    const { status, data } = error.response;
    throw getResponse(
      status,
      data?.message || "An error occurred during logging"
    );
  }
};

export { registerUser, loginUser };

async function createNewUserInDb(response) {
  const userId = response.data.identities[0].user_id;
  const userRepository = new UserRepository();
  await userRepository.create(userId, false);
}
