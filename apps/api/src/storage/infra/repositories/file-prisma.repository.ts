import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileEntity } from 'src/storage/domain/entities/file.entity';
import { IFileRepository } from 'src/storage/domain/repositories/file.repository';

@Injectable()
export class FilePrismaRepository implements IFileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: FileEntity): Promise<void> {
    await this.prismaService.prisma.file.create({
      data: {
        id: data.id,
        name: data.name,
        hash: data.hash,
        extension: data.extension,
        size: data.size,
        createdAt: data.createdAt,
      },
    });
  }

  async findByHash(hash: string): Promise<FileEntity | null> {
    const file = await this.prismaService.prisma.file.findUnique({
      where: { hash },
    });

    if (!file) return null;

    return FileEntity.restore(
      file.id,
      file.name,
      file.hash,
      file.extension,
      file.size,
      file.createdAt,
    );
  }
}
