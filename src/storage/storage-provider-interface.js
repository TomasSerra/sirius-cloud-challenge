class StorageProvider {
  async upload(file) {
    console.log(file);
    throw new Error("Method 'upload' must be implemented.");
  }

  async download(fileKey) {
    console.log(fileKey);
    throw new Error("Method 'download' must be implemented.");
  }
}

export default StorageProvider;
