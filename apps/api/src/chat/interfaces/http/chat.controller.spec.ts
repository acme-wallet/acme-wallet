import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { ChatStreamEvent } from '@repo/schemas';
import { Server } from 'http';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import { mock } from 'vitest-mock-extended';
import { ILlmProvider } from '../../application/ports/llm.provider';
import { ChatStreamUseCase } from '../../application/use-cases/chat-stream.use-case';
import { OllamaAdapter } from '../../infra/adapters/ollama.adapter';
import { ChatController } from './chat.controller';

// eslint-disable-next-line @typescript-eslint/require-await
async function* makeGenerator(
  events: ChatStreamEvent[],
): AsyncGenerator<ChatStreamEvent> {
  for (const event of events) {
    yield event;
  }
}

describe('Chat HTTP API', () => {
  let app: INestApplication;
  let server: Server;

  const chatStreamUseCase = mock<ChatStreamUseCase>();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatStreamUseCase, useValue: chatStreamUseCase }],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();

    server = app.getHttpServer() as Server;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /chat/stream', () => {
    it('should return 200 with text/event-stream content-type', async () => {
      chatStreamUseCase.execute.mockReturnValue(
        makeGenerator([
          { type: 'text_delta', delta: 'Hello' },
          { type: 'done' },
        ]),
      );

      const response = await request(server)
        .post('/chat/stream')
        .send({ message: 'Hi' });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    });

    it('should write SSE events to the response body', async () => {
      chatStreamUseCase.execute.mockReturnValue(
        makeGenerator([
          { type: 'text_delta', delta: 'world' },
          { type: 'done' },
        ]),
      );

      const response = await request(server)
        .post('/chat/stream')
        .send({ message: 'Hello' });

      expect(response.text).toContain(
        'data: {"type":"text_delta","delta":"world"}',
      );
      expect(response.text).toContain('data: {"type":"done"}');
    });

    it('should write reasoning_delta and text_delta SSE events', async () => {
      chatStreamUseCase.execute.mockReturnValue(
        makeGenerator([
          { type: 'reasoning_delta', delta: 'thinking...' },
          { type: 'text_delta', delta: 'answer' },
          { type: 'done' },
        ]),
      );

      const response = await request(server)
        .post('/chat/stream')
        .send({ message: 'Why?' });

      expect(response.text).toContain(
        'data: {"type":"reasoning_delta","delta":"thinking..."}',
      );
      expect(response.text).toContain(
        'data: {"type":"text_delta","delta":"answer"}',
      );
    });

    it('should stop after error event', async () => {
      chatStreamUseCase.execute.mockReturnValue(
        makeGenerator([
          { type: 'error', message: 'fail' },
          { type: 'text_delta', delta: 'should not appear' },
        ]),
      );

      const response = await request(server)
        .post('/chat/stream')
        .send({ message: 'Hello' });

      expect(response.text).toContain('"type":"error"');
      expect(response.text).not.toContain('should not appear');
    });

    it('should return 400 when message is missing', async () => {
      const response = await request(server).post('/chat/stream').send({});

      expect(response.status).toBe(400);
    });

    it('should pass systemPrompt and model to the use case', async () => {
      chatStreamUseCase.execute.mockReturnValue(
        makeGenerator([{ type: 'done' }]),
      );

      await request(server).post('/chat/stream').send({
        message: 'Hi',
        systemPrompt: 'Be concise.',
      });

      expect(chatStreamUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Hi',
          systemPrompt: 'Be concise.',
        }),
      );
    });
  });
});

describe('Chat HTTP API — with OllamaAdapter (stub / not implemented)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        ChatStreamUseCase,
        { provide: ILlmProvider, useClass: OllamaAdapter },
      ],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();

    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /chat/stream should write an SSE error event when OllamaAdapter is the provider', async () => {
    const response = await request(server)
      .post('/chat/stream')
      .send({ message: 'Hi' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/event-stream/);
    expect(response.text).toContain('"type":"error"');
    expect(response.text).toContain('OllamaAdapter is not yet implemented.');
  });
});
