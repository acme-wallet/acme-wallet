import { IWalletSpreadsheetExtractor } from 'src/wallet/application/ports/wallet-spreadsheet-extractor.port';
import { mock, MockProxy } from 'vitest-mock-extended';
import ExtractWalletSpreadsheetUseCase from './extract-wallet-spreadsheet.use-case';

describe('Extract Wallet Spreadsheet Use Case', () => {
  let spreadsheetExtractor: MockProxy<IWalletSpreadsheetExtractor>;
  let sut: ExtractWalletSpreadsheetUseCase;

  beforeEach(() => {
    spreadsheetExtractor = mock<IWalletSpreadsheetExtractor>();
    sut = new ExtractWalletSpreadsheetUseCase(spreadsheetExtractor);
  });

  it('should extract rows and return a preview with max 5 items', () => {
    const fileBuffer = Buffer.from('spreadsheet-buffer');
    const rows = Array.from({ length: 7 }, (_, index) => ({
      Date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      Amount: index + 1,
    }));

    spreadsheetExtractor.extract.mockReturnValue({
      sheetName: 'Wallet',
      rows,
    });

    const output = sut.execute({ fileBuffer });

    expect(spreadsheetExtractor.extract).toHaveBeenCalledWith(fileBuffer);
    expect(output).toEqual({
      sheetName: 'Wallet',
      totalRows: 7,
      preview: rows.slice(0, 5),
    });
  });
});
