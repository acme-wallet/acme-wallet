import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { FileEntity } from '../../domain/entities/file.entity';
import { IFileRepository } from '../../domain/repositories/file.repository';
import { UploadFileInputDto } from '../../interfaces/dto/upload-file-input.dto';
import { UploadFileOutputDto } from '../../interfaces/dto/upload-file-output.dto';
import { IStorageAdapter } from '../ports/storage.adapter.port';

@Injectable()
export class UploadFileUseCase implements IUseCase<
  UploadFileInputDto,
  Promise<UploadFileOutputDto>
> {
  constructor(
    private readonly storageAdapter: IStorageAdapter,
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(input: UploadFileInputDto): Promise<UploadFileOutputDto> {
    const fileEntity = FileEntity.create(
      input.name,
      input.hash,
      input.extension,
      input.size,
    );

    const filenameInStorage = `${fileEntity.id}${input.extension}`;
    await this.storageAdapter.uploadFile(input.buffer, filenameInStorage);

    await this.fileRepository.create(fileEntity);

    return { id: fileEntity.id };
  }
}
