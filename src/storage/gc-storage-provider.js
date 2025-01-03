import StorageProvider from "./storageProviderInterface";
import { Storage } from "@google-cloud/storage";
import { getResponse } from "../responses/response-mapper";

class GCSStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.gcs = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE_PATH,
    });
    this.bucketName = process.env.GCP_BUCKET_NAME;
  }

  async upload(file) {
    const bucket = this.gcs.bucket(this.bucketName);
    const blob = bucket.file(file.filename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });
    return new Promise((resolve, reject) => {
      blobStream.on("finish", () =>
        resolve(
          `https://storage.googleapis.com/${this.bucketName}/${file.filename}`
        )
      );
      blobStream.on("error", reject);
      blobStream.end(file.buffer);
    });
  }

  async download(filename) {
    const bucket = this.gcs.bucket(this.bucketName);
    const file = bucket.file(filename);
    const [exists] = await file.exists();
    if (!exists) throw new getResponse(404, "File not found");

    return file.createReadStream();
  }
}

module.exports = GCSStorageProvider;
