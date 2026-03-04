import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { CheckUniqueFileHashUseCase } from 'src/storage/application/use-cases/check-unique-file-hash.use-case';
import { UploadFileUseCase } from 'src/storage/application/use-cases/upload-file.use-case';
import { IWalletSpreadsheetExtractor } from 'src/wallet/application/ports/wallet-spreadsheet-extractor.port';
import {
  ExtractWalletSpreadsheetInputDto,
  ExtractWalletSpreadsheetOutputDto,
} from 'src/wallet/interfaces/dto/wallet/extract-wallet-spreadsheet.dto';

@Injectable()
export class ExtractWalletSpreadsheetUseCase implements IUseCase<
  ExtractWalletSpreadsheetInputDto,
  Promise<ExtractWalletSpreadsheetOutputDto>
> {
  private readonly PREVIEW_LIMIT = 5;
  constructor(
    private readonly walletSpreadsheetExtractor: IWalletSpreadsheetExtractor,
    private readonly checkUniqueFileHashUseCase: CheckUniqueFileHashUseCase,
    private readonly uploadFileUseCase: UploadFileUseCase,
  ) {}

  async execute(
    input: ExtractWalletSpreadsheetInputDto,
  ): Promise<ExtractWalletSpreadsheetOutputDto> {
    const { hash } = await this.checkUniqueFileHashUseCase.execute({
      buffer: input.fileBuffer,
    });

    const { sheetName, rows } = this.walletSpreadsheetExtractor.extract(
      input.fileBuffer,
    );

    await this.uploadFileUseCase.execute({
      buffer: input.fileBuffer,
      name: input.fileName,
      hash,
      extension: input.fileExtension,
      size: input.fileSize,
    });

    return {
      sheetName,
      totalRows: rows.length,
      preview: rows.slice(0, this.PREVIEW_LIMIT),
    };
  }
}
