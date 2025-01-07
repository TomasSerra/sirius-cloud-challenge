import { getResponse } from "../responses/response-mapper.js";
import { extractUserIdFromToken } from "../utils/decode-token.js";
import { AzureStorageProvider } from "../storage/ab-storage-provider.js";

const uploadFile = async (file, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !file) {
    throw getResponse(400, "userId and file are required");
  }
  const sp = new AzureStorageProvider();
  try {
    const fileUrl = await sp.upload(file, userId);
    return fileUrl;
  } catch (error) {
    resolveError(error);
  }
};

const downloadFile = async (filename, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !filename) {
    throw getResponse(400, "userId and filename are required");
  }
  const sp = new AzureStorageProvider();
  try {
    const fileUrl = await sp.download(filename, userId);
    return fileUrl;
  } catch (error) {
    resolveError(error);
  }
};

const shareFile = async (filename, email, req) => {
  const userId = await extractUserIdFromToken(req);
  if (!userId || !filename || !email) {
    throw getResponse(400, "userId, filename, and email are required");
  }
};

function resolveError(error) {
  console.error("Error downloading file: ", error);
  // HTTP error
  if (error.response) {
    const { status, data } = error.response;
    throw getResponse(
      status,
      data?.message || "An error occurred uploading the file"
    );
  } else {
    console.error("An error occurred uploading the file");
    throw getResponse(500, "An error occurred uploading the file");
  }
}

export { uploadFile, downloadFile, shareFile };
