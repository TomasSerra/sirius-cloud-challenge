import axios from "axios";
import { getAuth0Token } from "../config/auth.js";

const registerUser = async (email, password) => {
  try {
    const accessToken = await getAuth0Token();

    const userResponse = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
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

export { registerUser };
