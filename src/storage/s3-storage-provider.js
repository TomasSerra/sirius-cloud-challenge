import StorageProvider from "./storage-provider-interface.js";
import AWS from "aws-sdk";

class S3StorageProvider extends StorageProvider {
  constructor() {
    super();
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  async upload(file) {
    const params = {
      Bucket: this.bucketName,
      Key: file.filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    return this.s3.upload(params).promise();
  }

  async download(fileKey) {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };
    return this.s3.getObject(params).createReadStream();
  }
}

export default S3StorageProvider;
