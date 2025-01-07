import StorageProvider from "./storage-provider-interface.js";
import { Storage } from "@google-cloud/storage";
import { getResponse } from "../responses/response-mapper.js";
import { hashFilename } from "../utils/hash-filename.js";

class GCSStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.gcs = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: "./gcs_key.json",
    });
    this.bucketName = process.env.GCP_BUCKET_NAME;
  }

  async upload(file, userId) {
    try {
      if (!file || !file.originalname || !file.buffer) {
        throw getResponse(500, "Invalid file object");
      }
      if (!userId) {
        throw getResponse(500, "Invalid userId");
      }

      const hashedFilename = hashFilename(file.originalname);
      const filePath = `${userId}/${hashedFilename}`;
      const bucket = this.gcs.bucket(`gs://${this.bucketName}`);
      const blob = bucket.file(filePath);

      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      await new Promise((resolve, reject) => {
        blobStream.on("finish", resolve);
        blobStream.on("error", reject);
        blobStream.end(file.buffer);
      });

      return `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
    } catch (error) {
      console.error("An error occurred uploading the file:", error);
      if (error.response) {
        const { status, data } = error.response;
        throw getResponse(
          status,
          data?.message || "An error occurred uploading the file"
        );
      } else {
        throw getResponse(500, "An error occurred uploading the file");
      }
    }
  }

  async download(filename, userId) {
    try {
      const bucket = this.gcs.bucket(this.bucketName);
      const filePath = `${userId}/${filename}`;
      const file = bucket.file(filePath);
      const [exists] = await file.exists();
      if (!exists) throw getResponse(404, "File not found");

      const url = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 10 * 60 * 1000, // 10 min
      });

      return url[0];
    } catch (error) {
      console.error("An error occurred generating the signed URL:", error);
      throw getResponse(500, "Error generating signed URL");
    }
  }
}

export { GCSStorageProvider };
