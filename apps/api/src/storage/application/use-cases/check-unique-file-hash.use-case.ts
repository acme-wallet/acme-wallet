import { ConflictException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IUseCase } from 'src/common/use-case.interface';
import { IFileRepository } from '../../domain/repositories/file.repository';

export interface CheckUniqueFileHashInputDto {
  buffer: Buffer;
}

export interface CheckUniqueFileHashOutputDto {
  hash: string;
}

@Injectable()
export class CheckUniqueFileHashUseCase implements IUseCase<
  CheckUniqueFileHashInputDto,
  CheckUniqueFileHashOutputDto
> {
  constructor(private readonly fileRepository: IFileRepository) {}

  async execute(
    input: CheckUniqueFileHashInputDto,
  ): Promise<CheckUniqueFileHashOutputDto> {
    const hash = createHash('sha256').update(input.buffer).digest('hex');

    const existingFile = await this.fileRepository.findByHash(hash);

    if (existingFile) {
      throw new ConflictException('File with this hash already exists');
    }

    return { hash };
  }
}
