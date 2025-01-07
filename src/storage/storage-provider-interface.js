class StorageProvider {
  async upload(file, userId) {
    console.log(file);
    console.log(userId);
    throw new Error("Method 'upload' must be implemented.");
  }

  async download(fileKey, userId) {
    console.log(fileKey);
    console.log(userId);
    throw new Error("Method 'download' must be implemented.");
  }
}

export default StorageProvider;
