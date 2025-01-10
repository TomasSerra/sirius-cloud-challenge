import crypto from "crypto";

const hashFilename = (filename) => {
  const date = new Date().toISOString();
  const input = filename + date;

  const hash = crypto.createHash("sha256");
  hash.update(input);
  const hashedFilename = hash.digest("hex");
  return hashedFilename;
};

export { hashFilename };
