import { mock, MockProxy } from 'vitest-mock-extended';
import { IFileRepository } from '../../domain/repositories/file.repository';
import { IStorageAdapter } from '../ports/storage.adapter.port';
import { UploadFileUseCase } from './upload-file.use-case';

describe('Upload File Use Case', () => {
  let fileRepository: MockProxy<IFileRepository>;
  let storageAdapter: MockProxy<IStorageAdapter>;
  let sut: UploadFileUseCase;

  beforeEach(() => {
    fileRepository = mock<IFileRepository>();
    storageAdapter = mock<IStorageAdapter>();
    sut = new UploadFileUseCase(storageAdapter, fileRepository);
  });

  it('should upload the file and save metadata maintaining consistency', async () => {
    const input = {
      buffer: Buffer.from('test content'),
      name: 'test.txt',
      hash: 'mock-hash',
      extension: '.txt',
      size: 1024,
    };

    fileRepository.create.mockResolvedValue(undefined);
    storageAdapter.uploadFile.mockResolvedValue('any-stored-name');

    const output = await sut.execute(input);

    expect(fileRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
        hash: input.hash,
        extension: input.extension,
        size: input.size,
      }),
    );

    const createdFile = fileRepository.create.mock.calls[0][0];

    expect(storageAdapter.uploadFile).toHaveBeenCalledWith(
      input.buffer,
      `${createdFile.id}${input.extension}`,
    );

    expect(output).toEqual({ id: createdFile.id });

    expect(fileRepository.create).toHaveBeenCalledTimes(1);
    expect(storageAdapter.uploadFile).toHaveBeenCalledTimes(1);
  });
});
