import { getResponse } from "../responses/response-mapper.js";
import { AzureStorageProvider } from "./ab-storage-provider.js";
import { GCSStorageProvider } from "./gc-storage-provider.js";

class StorageManager {
  constructor() {
    this.providers = [new AzureStorageProvider(), new GCSStorageProvider()];
  }

  async uploadFile(file, userId) {
    for (const provider of this.providers) {
      try {
        return await provider.upload(file, userId);
      } catch (error) {
        console.error(`Error uploading file to ${provider}: ${error}`);
      }
    }
    throw getResponse(500, "An error occurred uploading the file, retry later");
  }

  async downloadFile(filename, userId) {
    for (const provider of this.providers) {
      try {
        return await provider.download(filename, userId);
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
