class StorageProvider {
  async upload(file, hashedFilename, userId) {
    throw new Error("Method 'upload' must be implemented.");
  }

  async download(fileKey, userId) {
    throw new Error("Method 'download' must be implemented.");
  }
}

export default StorageProvider;
