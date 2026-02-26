import { Injectable } from '@nestjs/common';
import {
  IWalletSpreadsheetExtractor,
  WalletSpreadsheetExtractionResult,
  WalletSpreadsheetRow,
  WalletSpreadsheetRowValue,
} from 'src/wallet/application/ports/wallet-spreadsheet-extractor.port';
import { InvalidWalletSpreadsheetException } from 'src/wallet/domain/exceptions/invalid-wallet-spreadsheet.exception';

import * as XLSX from 'xlsx';

@Injectable()
export class XlsxWalletSpreadsheetExtractorAdapter implements IWalletSpreadsheetExtractor {
  extract(fileBuffer: Buffer): WalletSpreadsheetExtractionResult {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        throw new InvalidWalletSpreadsheetException(
          'Spreadsheet does not contain any sheets',
        );
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        raw: true,
        defval: null,
        blankrows: false,
      });

      if (matrix.length === 0) {
        throw new InvalidWalletSpreadsheetException(
          'Spreadsheet does not contain header row',
        );
      }

      const headerRow = matrix[0] ?? [];

      const headers = headerRow.map((header, index) =>
        this.resolveHeaderName(header, index),
      );

      const rows: WalletSpreadsheetRow[] = matrix.slice(1).map((row) => {
        const parsedRow: WalletSpreadsheetRow = {};

        headers.forEach((header, index) => {
          const value = row[index];
          parsedRow[header] = this.toWalletSpreadsheetValue(value);
        });

        return parsedRow;
      });

      return {
        sheetName: firstSheetName,
        rows,
      };
    } catch (error) {
      if (error instanceof InvalidWalletSpreadsheetException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new InvalidWalletSpreadsheetException(error.message);
      }

      throw new InvalidWalletSpreadsheetException(
        'Failed to extract wallet spreadsheet data',
      );
    }
  }

  private toWalletSpreadsheetValue(value: unknown): WalletSpreadsheetRowValue {
    if (value === undefined || value === null) {
      return null;
    }

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    return null;
  }

  private resolveHeaderName(header: unknown, index: number): string {
    if (typeof header === 'string') {
      const normalized = header.trim();
      return normalized.length > 0 ? normalized : `col_${index + 1}`;
    }

    if (typeof header === 'number' || typeof header === 'boolean') {
      return String(header);
    }

    if (header instanceof Date) {
      return header.toISOString();
    }

    return `col_${index + 1}`;
  }
}
