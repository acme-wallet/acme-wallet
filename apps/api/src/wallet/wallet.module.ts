import { Module } from '@nestjs/common';
import { IWalletSpreadsheetExtractor } from './application/ports/wallet-spreadsheet-extractor.port';
import ExtractWalletSpreadsheetUseCase from './application/use-cases/extract-wallet-spreadsheet.use-case';
import { XlsxWalletSpreadsheetExtractorAdapter } from './infra/adapters/xlsx-wallet-spreadsheet-extractor.adapter';
import { WalletController } from './interfaces/http/wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [
    ExtractWalletSpreadsheetUseCase,
    {
      provide: IWalletSpreadsheetExtractor,
      useClass: XlsxWalletSpreadsheetExtractorAdapter,
    },
  ],
})
export class WalletModule {}
