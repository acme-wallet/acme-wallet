import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { File } from '../../domain/entities/file.entity';
import { IStorageAdapter } from '../ports/storage.adapter.port';

export interface UploadFileInputDto {
  buffer: Buffer;
  name: string;
  hash: string;
  extension: string;
  size: number;
}

export interface UploadFileOutputDto {
  id: string;
}

@Injectable()
export class UploadFileUseCase implements IUseCase<
  UploadFileInputDto,
  Promise<UploadFileOutputDto>
> {
  constructor(
    private readonly storageAdapter: IStorageAdapter,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: UploadFileInputDto): Promise<UploadFileOutputDto> {
    const fileEntity = File.create(
      input.name,
      input.hash,
      input.extension,
      input.size,
    );

    const filenameInStorage = `${fileEntity.id}${input.extension}`;
    await this.storageAdapter.uploadFile(input.buffer, filenameInStorage);

    await this.prisma.prisma.file.create({
      data: {
        id: fileEntity.id,
        name: fileEntity.name,
        hash: fileEntity.hash,
        extension: fileEntity.extension,
        size: fileEntity.size,
        createdAt: fileEntity.createdAt,
      },
    });

    return { id: fileEntity.id };
  }
}
