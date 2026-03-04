import { ConflictException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IUseCase } from 'src/common/use-case.interface';
import { PrismaService } from 'src/prisma/prisma.service';

export interface CheckUniqueFileHashInputDto {
  buffer: Buffer;
}

export interface CheckUniqueFileHashOutputDto {
  hash: string;
}

@Injectable()
export class CheckUniqueFileHashUseCase implements IUseCase<
  CheckUniqueFileHashInputDto,
  CheckUniqueFileHashOutputDto
> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: CheckUniqueFileHashInputDto,
  ): Promise<CheckUniqueFileHashOutputDto> {
    const hash = createHash('sha256').update(input.buffer).digest('hex');

    const existingFile = await this.prisma.prisma.file.findUnique({
      where: { hash },
    });

    if (existingFile) {
      throw new ConflictException('File with this hash already exists');
    }

    return { hash };
  }
}
