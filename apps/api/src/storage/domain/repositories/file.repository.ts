import { FileEntity } from '../entities/file.entity';

export abstract class IFileRepository {
  abstract create(data: FileEntity): Promise<void>;
  abstract findByHash(hash: string): Promise<FileEntity | null>;
}
