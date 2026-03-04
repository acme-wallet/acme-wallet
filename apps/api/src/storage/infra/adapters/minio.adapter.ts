import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { Env } from 'src/common/configs/env.schema';
import { IStorageAdapter } from '../../application/ports/storage.adapter.port';

@Injectable()
export class MinioStorageAdapter implements IStorageAdapter, OnModuleInit {
  private readonly minioClient: Client;
  private readonly bucketName = 'uploads';
  private readonly logger = new Logger(MinioStorageAdapter.name);

  constructor(private readonly configService: ConfigService<Env, true>) {
    this.minioClient = new Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', { infer: true }),
      port: this.configService.get('MINIO_PORT', { infer: true }),
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY', { infer: true }),
      secretKey: this.configService.get('MINIO_SECRET_KEY', { infer: true }),
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Created Minio bucket: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error('Error initializing Minio bucket', error);
      throw new InternalServerErrorException('Failed to initialize Minio');
    }
  }

  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    try {
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        buffer,
        buffer.length,
      );
      this.logger.log(`Successfully uploaded file ${filename} to Minio`);
      return filename;
    } catch (error) {
      this.logger.error(`Failed to upload file ${filename} to Minio`, error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
