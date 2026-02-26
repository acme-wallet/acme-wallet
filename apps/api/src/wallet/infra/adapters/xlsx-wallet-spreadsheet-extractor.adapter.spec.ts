import * as XLSX from 'xlsx';
import { XlsxWalletSpreadsheetExtractorAdapter } from './xlsx-wallet-spreadsheet-extractor.adapter';

describe('Xlsx Wallet Spreadsheet Extractor Adapter', () => {
  it('should read first sheet and map rows using the header row', () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ['Date', 'Amount', 'Paid'],
      ['2026-01-01', 100, true],
      ['2026-01-02', 200, false],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Wallet');
    const fileBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer;

    const sut = new XlsxWalletSpreadsheetExtractorAdapter();
    const output = sut.extract(fileBuffer);

    expect(output).toEqual({
      sheetName: 'Wallet',
      rows: [
        { Date: '2026-01-01', Amount: 100, Paid: true },
        { Date: '2026-01-02', Amount: 200, Paid: false },
      ],
    });
  });

  it('should throw Error when spreadsheet is invalid', () => {
    const sut = new XlsxWalletSpreadsheetExtractorAdapter();

    expect(() => sut.extract(Buffer.alloc(0))).toThrow(Error);
  });
});
