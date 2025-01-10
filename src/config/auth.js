import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const authVariables = {
  authDomain: process.env.AUTH0_DOMAIN,
  authClientId: process.env.AUTH0_CLIENT_ID,
  authClientSecret: process.env.AUTH0_CLIENT_SECRET,
  authApiAudience: process.env.AUTH0_API_AUDIENCE,
  authIssuer: process.env.AUTH0_ISSUER,
};

class AuthManager {
  async #getAuth0Token() {
    try {
      const response = await axios.post(
        `https://${authVariables.authDomain}/oauth/token`,
        {
          grant_type: "client_credentials",
          client_id: authVariables.authClientId,
          client_secret: authVariables.authClientSecret,
          audience: `https://${authVariables.authDomain}/api/v2/`,
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error al obtener el token:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async login(email, password) {
    const accessToken = await this.#getAuth0Token();

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
    return response;
  }

  async register(email, password) {
    const accessToken = await this.#getAuth0Token();
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
    return response;
  }
}

export { AuthManager, authVariables };
