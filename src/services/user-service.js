import axios from "axios";
import { getAuth0Token, authVariables } from "../config/auth.js";

const registerUser = async (email, password) => {
  try {
    const accessToken = await getAuth0Token();

    const userResponse = await axios.post(
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

    return userResponse.data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
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
    throw new Error(error.response?.status || 500);
  }
};

export { registerUser, loginUser };
