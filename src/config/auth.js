import { auth } from "express-oauth2-jwt-bearer";
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

const jwtCheck = auth({
  audience: authVariables.authApiAudience,
  issuerBaseURL: authVariables.authIssuer,
  tokenSigningAlg: "RS256",
});

const getAuth0Token = async () => {
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
    return null;
  }
};

export { jwtCheck, getAuth0Token, authVariables };
