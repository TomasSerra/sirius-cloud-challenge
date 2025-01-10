import { auth } from "express-oauth2-jwt-bearer";
import { authVariables } from "../config/auth.js";

const jwtCheck = auth({
  audience: authVariables.authApiAudience,
  issuerBaseURL: authVariables.authIssuer,
  tokenSigningAlg: "RS256",
});

const middlewareJwtCheck = (req, res, next) => {
  jwtCheck(req, res, (err) => {
    if (err) {
      return res.status(401).send("Unauthorized: Invalid token");
    }
    next();
  });
};

export { middlewareJwtCheck };
