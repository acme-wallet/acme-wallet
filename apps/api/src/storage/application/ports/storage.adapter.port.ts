export abstract class IStorageAdapter {
  abstract uploadFile(buffer: Buffer, filename: string): Promise<string>;
}
