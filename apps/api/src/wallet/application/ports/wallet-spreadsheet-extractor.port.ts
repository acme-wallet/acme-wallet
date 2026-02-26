export type WalletSpreadsheetRowValue = string | number | boolean | null;

export type WalletSpreadsheetRow = Record<string, WalletSpreadsheetRowValue>;

export type WalletSpreadsheetExtractionResult = {
  sheetName: string;
  rows: WalletSpreadsheetRow[];
};

export abstract class IWalletSpreadsheetExtractor {
  abstract extract(fileBuffer: Buffer): WalletSpreadsheetExtractionResult;
}
