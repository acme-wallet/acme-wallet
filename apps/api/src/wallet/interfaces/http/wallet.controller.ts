import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import type {} from 'multer';
import { ExtractWalletSpreadsheetUseCase } from 'src/wallet/application';
import type {
  ExtractWalletSpreadsheetInputDto,
  ExtractWalletSpreadsheetOutputDto,
} from '../dto/wallet/extract-wallet-spreadsheet.dto';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly extractWalletSpreadsheetUseCase: ExtractWalletSpreadsheetUseCase,
  ) {}

  @Post('extract')
  @UseInterceptors(
    // TODO: We should use FileInterceptor instead of AnyFilesInterceptor.
    // And configure on Scalar
    AnyFilesInterceptor({
      limits: {
        files: 1,
        fileSize: MAX_FILE_SIZE_BYTES,
      },
    }),
  )
  async extract(
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ExtractWalletSpreadsheetOutputDto> {
    const file = files?.[0];

    if (!file?.buffer?.length) {
      throw new BadRequestException('File is required');
    }

    const originalName = file.originalname;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const inputDto: ExtractWalletSpreadsheetInputDto = {
      fileBuffer: file.buffer,
      fileName: originalName,
      fileExtension: extension,
      fileSize: file.size,
    };

    return await this.extractWalletSpreadsheetUseCase.execute(inputDto);
  }
}
