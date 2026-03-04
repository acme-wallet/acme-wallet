import { Module } from '@nestjs/common';
import { IStorageAdapter } from './application/ports/storage.adapter.port';
import { CheckUniqueFileHashUseCase } from './application/use-cases/check-unique-file-hash.use-case';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { IFileRepository } from './domain/repositories/file.repository';
import { MinioStorageAdapter } from './infra/adapters/minio.adapter';
import { FilePrismaRepository } from './infra/repositories/file-prisma.repository';

@Module({
  providers: [
    {
      provide: IStorageAdapter,
      useClass: MinioStorageAdapter,
    },
    {
      provide: IFileRepository,
      useClass: FilePrismaRepository,
    },
    UploadFileUseCase,
    CheckUniqueFileHashUseCase,
  ],
  exports: [UploadFileUseCase, CheckUniqueFileHashUseCase, IStorageAdapter],
})
export class StorageModule {}
