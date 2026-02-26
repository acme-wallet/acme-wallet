import { ExtractWalletSpreadsheetResponseSchema } from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';
import type { WalletSpreadsheetRow } from 'src/wallet/application/ports/wallet-spreadsheet-extractor.port';

export class ExtractWalletSpreadsheetRequest {
  fileBuffer!: Buffer;
}

export type ExtractWalletSpreadsheetInputDto = ExtractWalletSpreadsheetRequest;

export class ExtractWalletSpreadsheetResponse extends createZodDto(
  ExtractWalletSpreadsheetResponseSchema,
) {}

export type ExtractWalletSpreadsheetOutputDto =
  ExtractWalletSpreadsheetResponse;
export type ExtractWalletSpreadsheetRowOutputDto = WalletSpreadsheetRow;
