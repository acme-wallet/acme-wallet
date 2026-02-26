import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/use-case.interface';
import { IWalletSpreadsheetExtractor } from 'src/wallet/application/ports/wallet-spreadsheet-extractor.port';
import {
  ExtractWalletSpreadsheetInputDto,
  ExtractWalletSpreadsheetOutputDto,
} from 'src/wallet/interfaces/dto/wallet/extract-wallet-spreadsheet.dto';

const PREVIEW_LIMIT = 5;

@Injectable()
export default class ExtractWalletSpreadsheetUseCase implements IUseCase<
  ExtractWalletSpreadsheetInputDto,
  ExtractWalletSpreadsheetOutputDto
> {
  constructor(
    private readonly walletSpreadsheetExtractor: IWalletSpreadsheetExtractor,
  ) {}

  execute(
    input: ExtractWalletSpreadsheetInputDto,
  ): ExtractWalletSpreadsheetOutputDto {
    const { sheetName, rows } = this.walletSpreadsheetExtractor.extract(
      input.fileBuffer,
    );

    return {
      sheetName,
      totalRows: rows.length,
      preview: rows.slice(0, PREVIEW_LIMIT),
    };
  }
}
