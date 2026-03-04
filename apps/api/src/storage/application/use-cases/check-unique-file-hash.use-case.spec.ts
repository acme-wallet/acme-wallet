import { ConflictException } from '@nestjs/common';
import { createHash } from 'crypto';
import { FileEntity } from 'src/storage/domain/entities/file.entity';
import { mock, MockProxy } from 'vitest-mock-extended';
import { IFileRepository } from '../../domain/repositories/file.repository';
import { CheckUniqueFileHashUseCase } from './check-unique-file-hash.use-case';

describe('Check Unique File Hash Use Case', () => {
  let fileRepository: MockProxy<IFileRepository>;
  let sut: CheckUniqueFileHashUseCase;

  beforeEach(() => {
    fileRepository = mock<IFileRepository>();
    sut = new CheckUniqueFileHashUseCase(fileRepository);
  });

  const mockBuffer = Buffer.from('test file content');
  const mockHash = createHash('sha256').update(mockBuffer).digest('hex');

  it('should return the hash if the file does not exist', async () => {
    fileRepository.findByHash.mockResolvedValue(null);

    const result = await sut.execute({ buffer: mockBuffer });

    expect(fileRepository.findByHash).toHaveBeenCalledWith(mockHash);
    expect(result).toEqual({ hash: mockHash });
    expect(fileRepository.findByHash).toHaveBeenCalledTimes(1);
  });

  it('should throw ConflictException if the file already exists', async () => {
    fileRepository.findByHash.mockResolvedValue(
      FileEntity.restore(
        'any-id',
        'any-name',
        'any-hash',
        '.txt',
        1024,
        new Date(),
      ),
    );

    await expect(sut.execute({ buffer: mockBuffer })).rejects.toThrow(
      ConflictException,
    );

    await expect(sut.execute({ buffer: mockBuffer })).rejects.toThrow(
      'File with this hash already exists',
    );

    expect(fileRepository.findByHash).toHaveBeenCalledWith(mockHash);
  });
});
