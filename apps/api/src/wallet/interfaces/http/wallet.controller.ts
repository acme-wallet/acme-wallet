import {
  UploadedFiles,
  BadRequestException,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import ExtractWalletSpreadsheetUseCase from 'src/wallet/application/use-cases/extract-wallet-spreadsheet.use-case';
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
    AnyFilesInterceptor({
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
        files: 1,
      },
    }),
  )
  extract(
    @UploadedFiles() files?: Array<{ buffer?: Buffer }>,
  ): ExtractWalletSpreadsheetOutputDto {
    const file = files?.[0];

    if (!file?.buffer?.length) {
      throw new BadRequestException('File is required');
    }

    const inputDto: ExtractWalletSpreadsheetInputDto = {
      fileBuffer: file.buffer,
    };

    try {
      return this.extractWalletSpreadsheetUseCase.execute(inputDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
