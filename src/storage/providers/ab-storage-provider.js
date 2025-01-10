import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import StorageProvider from "./storage-provider-interface.js";
import { getResponse } from "../../responses/response-mapper.js";

class AzureStorageProvider extends StorageProvider {
  constructor() {
    super();
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const sharedKeyCredential = new StorageSharedKeyCredential(
      account,
      accountKey
    );
    this.blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      sharedKeyCredential
    );
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    this.sharedKeyCredential = sharedKeyCredential;
  }

  async upload(file, hashedFilename, userId) {
    try {
      if (!file || !file.originalname || !file.buffer) {
        throw getResponse(500, "Invalid file object");
      }
      if (!userId) {
        throw getResponse(500, "Invalid userId");
      }

      const blobName = `${userId}/${hashedFilename}`;
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName
      );
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${this.containerName}/${blobName}`;
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
      const blobName = `${userId}/${filename}`;
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName
      );
      const blobClient = containerClient.getBlockBlobClient(blobName);

      const exists = await blobClient.exists();
      if (!exists) throw getResponse(404, "File not found");

      const sasParams = generateBlobSASQueryParameters(
        {
          containerName: this.containerName,
          blobName: blobName,
          permissions: BlobSASPermissions.parse("r"),
          expiresOn: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        },
        this.sharedKeyCredential
      );

      const sasUrl = `${blobClient.url}?${sasParams.toString()}`;
      return sasUrl;
    } catch (error) {
      console.error("An error occurred downloading the file:", error);
      if (error.response) {
        const { status, data } = error.response;
        throw getResponse(
          status,
          data?.message || "An error occurred downloading the file"
        );
      } else {
        throw getResponse(500, "An error occurred downloading the file");
      }
    }
  }
}

export { AzureStorageProvider };
