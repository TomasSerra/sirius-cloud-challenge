import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const jwtCheck = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const getAuth0Token = async () => {
  try {
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error al obtener el token:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

export { jwtCheck, getAuth0Token };
