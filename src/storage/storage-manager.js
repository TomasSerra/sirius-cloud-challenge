import { getResponse } from "../responses/response-mapper.js";
import { AzureStorageProvider } from "./ab-storage-provider.js";
import { GCSStorageProvider } from "./gc-storage-provider.js";

class StorageManager {
  constructor() {
    this.providers = [new AzureStorageProvider(), new GCSStorageProvider()];
  }

  async uploadFile(file, hashedFilename, userId) {
    let successUpload = false;
    for (const provider of this.providers) {
      try {
        await provider.upload(file, hashedFilename, userId);
        successUpload = true;
      } catch (error) {
        console.error(`Error uploading file: ${error}`);
      }
    }
    if (!successUpload) {
      throw getResponse(
        500,
        "An error occurred uploading the file, retry later"
      );
    }
  }

  async downloadFile(cloudFilename, userId) {
    for (const provider of this.providers) {
      try {
        return await provider.download(cloudFilename, userId);
      } catch (error) {
        console.error(`Error downloading file from ${provider}: ${error}`);
      }
    }
    throw getResponse(
      500,
      "An error occurred downloading the file, retry later"
    );
  }
}

export { StorageManager };
