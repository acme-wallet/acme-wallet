export class InvalidWalletSpreadsheetException extends Error {
  constructor(message = 'Invalid wallet spreadsheet') {
    super(message);
    this.name = 'InvalidWalletSpreadsheetException';
  }
}
