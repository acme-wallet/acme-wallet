export interface UploadFileInputDto {
  buffer: Buffer;
  name: string;
  hash: string;
  extension: string;
  size: number;
}
