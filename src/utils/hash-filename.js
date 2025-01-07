import crypto from "crypto";

const hashFilename = (filename) => {
  const hash = crypto.createHash("sha256");
  hash.update(filename);
  const hashedFilename = hash.digest("hex");
  return hashedFilename;
};

export { hashFilename };
