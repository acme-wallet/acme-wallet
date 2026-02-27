import { z } from 'zod';

const WalletSpreadsheetRowValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const ExtractWalletSpreadsheetResponseSchema = z.object({
  sheetName: z.string(),
  totalRows: z.number().int().nonnegative(),
  preview: z.array(z.record(z.string(), WalletSpreadsheetRowValueSchema)),
});

export type ExtractWalletSpreadsheetOutput = z.infer<
  typeof ExtractWalletSpreadsheetResponseSchema
>;
