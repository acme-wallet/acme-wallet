import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import ExtractWalletSpreadsheetUseCase from 'src/wallet/application/use-cases/extract-wallet-spreadsheet.use-case';
import request from 'supertest';
import { mock } from 'vitest-mock-extended';
import { WalletController } from './wallet.controller';

describe('Wallet HTTP API', () => {
  let app: INestApplication;
  let server: Server;

  const extractWalletSpreadsheetUseCase =
    mock<ExtractWalletSpreadsheetUseCase>();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: ExtractWalletSpreadsheetUseCase,
          useValue: extractWalletSpreadsheetUseCase,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    await app.init();

    server = app.getHttpServer() as Server;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /wallet/extract', () => {
    it('should return 201 with json preview payload', async () => {
      extractWalletSpreadsheetUseCase.execute.mockResolvedValue({
        sheetName: 'Wallet',
        totalRows: 2,
        preview: [
          { Date: '2026-01-01', Amount: 10 },
          { Date: '2026-01-02', Amount: 20 },
        ],
      });

      const response = await request(server)
        .post('/wallet/extract')
        .attach('file', Buffer.from('excel-file-content'), 'wallet.xlsx');

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        sheetName: 'Wallet',
        totalRows: 2,
        preview: [
          { Date: '2026-01-01', Amount: 10 },
          { Date: '2026-01-02', Amount: 20 },
        ],
      });
      expect(extractWalletSpreadsheetUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 201 when uploaded field name is not "file"', async () => {
      extractWalletSpreadsheetUseCase.execute.mockResolvedValue({
        sheetName: 'Wallet',
        totalRows: 1,
        preview: [{ Date: '2026-01-01', Amount: 10 }],
      });

      const response = await request(server)
        .post('/wallet/extract')
        .attach(
          'Descarte.xlsx',
          Buffer.from('excel-file-content'),
          'Descarte.xlsx',
        );

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(extractWalletSpreadsheetUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return 400 when file is missing', async () => {
      const response = await request(server).post('/wallet/extract');

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(extractWalletSpreadsheetUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 400 when more than one file is uploaded', async () => {
      const response = await request(server)
        .post('/wallet/extract')
        .attach('file', Buffer.from('excel-file-content-1'), 'wallet-1.xlsx')
        .attach('file', Buffer.from('excel-file-content-2'), 'wallet-2.xlsx');

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(extractWalletSpreadsheetUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return 413 when file size is greater than 5MB', async () => {
      const fileBiggerThan5Mb = Buffer.alloc(5 * 1024 * 1024 + 1, 'a');

      const response = await request(server)
        .post('/wallet/extract')
        .attach('file', fileBiggerThan5Mb, 'wallet.xlsx');

      expect(response.statusCode).toBe(413);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(extractWalletSpreadsheetUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
