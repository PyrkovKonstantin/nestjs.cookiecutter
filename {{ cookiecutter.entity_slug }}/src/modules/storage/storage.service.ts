import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageService {
  private S3: AWS.S3;

  private BUCKET: string;

  constructor() {
    this.S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    this.BUCKET = process.env.AWS_BUCKET || '';
  }

  async uploadFile(
    file: Buffer,
    fileKey: string,
  ): Promise<AWS.S3.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.BUCKET,
        Key: fileKey,
        Body: file,
      };
      this.S3.putObject(params, (err, data) => {
        if (err) return reject(err);

        return resolve(data);
      });
    });
  }

  async deleteFile(fileKey: string) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.BUCKET,
        Key: fileKey,
      };
      this.S3.deleteObject(params, (err, data) => {
        if (err) return reject(err);

        return resolve(data);
      });
    });
  }

  async getObject(Key: string): Promise<AWS.S3.GetObjectOutput> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.BUCKET,
        Key,
      };
      this.S3.getObject(params, (err, data) => {
        if (err) return reject(err);

        return resolve(data);
      });
    });
  }
}
