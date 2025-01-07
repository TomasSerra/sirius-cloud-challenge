import S3StorageProvider from "./ab-storage-provider.js";
import GCSStorageProvider from "./gc-storage-provider.js";

class StorageManager {
  constructor() {
    this.providers = [new S3StorageProvider(), new GCSStorageProvider()];
  }

  async uploadFile(file, userId) {
    for (const provider of this.providers) {
      try {
        return await provider.upload(file, userId);
      } catch (error) {
        console.error(`Error uploading file to ${provider.name}: ${error}`);
      }
    }
  }

  async downloadFile(filename, userId) {
    for (const provider of this.providers) {
      try {
        return await provider.download(filename, userId);
      } catch (error) {
        console.error(`Error downloading file from ${provider.name}: ${error}`);
      }
    }
  }
}

export { StorageManager };
