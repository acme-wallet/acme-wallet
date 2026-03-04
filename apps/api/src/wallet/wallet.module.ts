import { Module } from '@nestjs/common';
import { ExtractWalletSpreadsheetUseCase } from './application';
import { IWalletSpreadsheetExtractor } from './application/ports/wallet-spreadsheet-extractor.port';
import { XlsxWalletSpreadsheetExtractorAdapter } from './infra/adapters/xlsx-wallet-spreadsheet-extractor.adapter';
import { WalletController } from './interfaces/http/wallet.controller';

import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
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
