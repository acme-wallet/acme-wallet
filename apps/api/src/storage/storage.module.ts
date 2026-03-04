import { Module } from '@nestjs/common';
import { IStorageAdapter } from './application/ports/storage.adapter.port';
import { CheckUniqueFileHashUseCase } from './application/use-cases/check-unique-file-hash.use-case';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { MinioStorageAdapter } from './infra/adapters/minio.adapter';

@Module({
  providers: [
    {
      provide: IStorageAdapter,
      useClass: MinioStorageAdapter,
    },
    UploadFileUseCase,
    CheckUniqueFileHashUseCase,
  ],
  exports: [UploadFileUseCase, CheckUniqueFileHashUseCase, IStorageAdapter],
})
export class StorageModule {}
