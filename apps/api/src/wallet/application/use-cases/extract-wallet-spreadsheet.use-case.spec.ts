import { CheckUniqueFileHashUseCase } from 'src/storage/application/use-cases/check-unique-file-hash.use-case';
import { UploadFileUseCase } from 'src/storage/application/use-cases/upload-file.use-case';
import { IWalletSpreadsheetExtractor } from 'src/wallet/application/ports/wallet-spreadsheet-extractor.port';
import { mock, MockProxy } from 'vitest-mock-extended';
import { ExtractWalletSpreadsheetUseCase } from './extract-wallet-spreadsheet.use-case';

describe('Extract Wallet Spreadsheet Use Case', () => {
  let spreadsheetExtractor: MockProxy<IWalletSpreadsheetExtractor>;
  let checkUniqueFileHashUseCase: MockProxy<CheckUniqueFileHashUseCase>;
  let uploadFileUseCase: MockProxy<UploadFileUseCase>;
  let sut: ExtractWalletSpreadsheetUseCase;

  beforeEach(() => {
    spreadsheetExtractor = mock<IWalletSpreadsheetExtractor>();
    checkUniqueFileHashUseCase = mock<CheckUniqueFileHashUseCase>();
    uploadFileUseCase = mock<UploadFileUseCase>();
    sut = new ExtractWalletSpreadsheetUseCase(
      spreadsheetExtractor,
      checkUniqueFileHashUseCase,
      uploadFileUseCase,
    );
  });

  it('should extract rows and return a preview with max 5 items', async () => {
    const fileBuffer = Buffer.from('spreadsheet-buffer');
    const fileName = 'test.xlsx';
    const fileExtension = '.xlsx';
    const fileSize = fileBuffer.length;
    const hash = 'fake-hash';
    const rows = Array.from({ length: 7 }, (_, index) => ({
      Date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      Amount: index + 1,
    }));

    spreadsheetExtractor.extract.mockReturnValue({
      sheetName: 'Wallet',
      rows,
    });

    checkUniqueFileHashUseCase.execute.mockResolvedValue({ hash });
    uploadFileUseCase.execute.mockResolvedValue({ id: 'fake-id' });

    const output = await sut.execute({
      fileBuffer,
      fileName,
      fileExtension,
      fileSize,
    });

    expect(checkUniqueFileHashUseCase.execute).toHaveBeenCalledWith({
      buffer: fileBuffer,
    });
    expect(spreadsheetExtractor.extract).toHaveBeenCalledWith(fileBuffer);
    expect(uploadFileUseCase.execute).toHaveBeenCalledWith({
      buffer: fileBuffer,
      name: fileName,
      hash,
      extension: fileExtension,
      size: fileSize,
    });
    expect(output).toEqual({
      sheetName: 'Wallet',
      totalRows: 7,
      preview: rows.slice(0, 5),
    });
  });

  it.each([
    'Spreadsheet does not contain any sheets',
    'Spreadsheet does not contain header row',
  ])('should propagate extractor exception: %s', async (message) => {
    const fileBuffer = Buffer.from('spreadsheet-buffer');
    const fileName = 'test.xlsx';
    const fileExtension = '.xlsx';
    const fileSize = fileBuffer.length;
    const expectedError = new Error(message);

    checkUniqueFileHashUseCase.execute.mockResolvedValue({
      hash: 'fake-hash',
    });

    spreadsheetExtractor.extract.mockImplementation(() => {
      throw expectedError;
    });

    await expect(
      sut.execute({ fileBuffer, fileName, fileExtension, fileSize }),
    ).rejects.toThrow(expectedError);
    expect(spreadsheetExtractor.extract).toHaveBeenCalledWith(fileBuffer);
    expect(uploadFileUseCase.execute).not.toHaveBeenCalled();
  });
});
