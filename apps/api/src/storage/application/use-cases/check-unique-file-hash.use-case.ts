import { ConflictException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IUseCase } from 'src/common/use-case.interface';
import { IFileRepository } from '../../domain/repositories/file.repository';
import { CheckUniqueFileHashInputDto } from '../../interfaces/dto/check-unique-file-hash-input.dto';
import { CheckUniqueFileHashOutputDto } from '../../interfaces/dto/check-unique-file-hash-output.dto';

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
