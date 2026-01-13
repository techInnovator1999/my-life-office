import { AllConfigType } from '@/config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import fs from 'fs';
@Injectable()
export class S3FileService {
  private readonly accesskeyId?: string;
  private readonly secretAccessKey?: string;
  private readonly awsS3Region?: string;
  private readonly s3Bucket: string;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.accesskeyId = this.configService.getOrThrow('file.accessKeyId', {
      infer: true,
    });
    this.secretAccessKey = this.configService.getOrThrow(
      'file.secretAccessKey',
      { infer: true },
    );
    this.awsS3Region = this.configService.getOrThrow('file.awsS3Region', {
      infer: true,
    });
    this.s3Bucket = this.configService.getOrThrow('file.awsDefaultS3Bucket', {
      infer: true,
    });
  }

  s3 = new AWS.S3({
    region: this.awsS3Region,
    accessKeyId: this.accesskeyId,
    secretAccessKey: this.secretAccessKey,
  });

  async uploadFile(originalname, mimetype): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        ACL: 'public-read',
        region: this.awsS3Region,
        Bucket: this.s3Bucket,
        Key: String(originalname),
        ContentType: mimetype,
        Body: fs.createReadStream('files/' + originalname),
      };

      this.s3.upload(params, (err, data) => {
        if (err) {
          console.log('Error uploading file:', err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  }

  async uploadFileFromBuffer(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        ACL: 'public-read',
        region: this.awsS3Region,
        Bucket: this.s3Bucket,
        Key: filename,
        ContentType: mimetype,
        Body: buffer,
      };

      this.s3.upload(params, (err, data) => {
        if (err) {
          console.log('Error uploading file:', err);
          reject(err);
        } else {
          console.log(data.Location);
          resolve(data.Location);
        }
      });
    });
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    try {
      const params = {
        Bucket: this.s3Bucket,
        Key: key,
      };

      const data = await this.s3.getObject(params).promise();
      return data.Body as Buffer;
    } catch (error) {
      throw new Error(`Failed to fetch file from S3: ${error.message}`);
    }
  }
}
