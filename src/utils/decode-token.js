import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { authVariables } from "../config/auth";

const client = jwksClient({
  jwksUri: `https://${authVariables.authDomain}/.well-known/jwks.json`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const extractNameFromToken = (req) => {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reject(new Error("Token not provided or invalid format"));
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        return reject(new Error("Invalid or expired token"));
      }

      const { name } = decoded;
      if (!name) {
        return reject(new Error("Name not found in token payload"));
      }

      resolve(name);
    });
  });
};

export { extractNameFromToken };
