import {
  BadRequestException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ChatStreamEvent } from '@repo/schemas';
import OpenAI from 'openai';
import { Env } from 'src/common/configs/env.schema';
import { type Mock } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { LlamacppAdapter } from './llamacpp.adapter';

describe('LlamacppAdapter', () => {
  let configService: MockProxy<ConfigService<Env, true>>;
  let sut: LlamacppAdapter;
  let mockCreate: Mock;

  beforeEach(() => {
    configService = mock<ConfigService<Env, true>>();
    configService.get.mockReturnValue('http://test-url:8080');

    mockCreate = vi.fn();

    sut = new LlamacppAdapter(configService);

    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const clientOverride = {
      chat: {
        completions: {
          create: mockCreate as unknown as OpenAI.Chat.Completions['create'],
        },
      },
    };
    Object.assign(
      (sut as unknown as { client: OpenAI }).client,
      clientOverride,
    );

    vi.clearAllMocks();
  });

  async function* createMockStream<T>(chunks: T[]) {
    for (const chunk of chunks) {
      await Promise.resolve();
      yield chunk;
    }
  }

  it('should stream text_delta events correctly', async () => {
    mockCreate.mockResolvedValue(
      createMockStream([
        { choices: [{ delta: { content: 'Hel' } }] },
        { choices: [{ delta: { content: 'lo' } }] },
      ]),
    );

    const generator = sut.stream({ message: 'Hi' });
    const events: ChatStreamEvent[] = [];

    for await (const event of generator) {
      events.push(event);
    }

    expect(events).toEqual([
      { type: 'text_delta', delta: 'Hel' },
      { type: 'text_delta', delta: 'lo' },
      { type: 'done' },
    ]);
  });

  it('should handle reasoning_delta if provided', async () => {
    mockCreate.mockResolvedValue(
      createMockStream([
        { choices: [{ delta: { reasoning: 'Hmm' } }] },
        { choices: [{ delta: { content: 'Answer' } }] },
      ]),
    );

    const generator = sut.stream({ message: 'Why?' });
    const events: ChatStreamEvent[] = [];

    for await (const event of generator) {
      events.push(event);
    }

    expect(events).toEqual([
      { type: 'reasoning_delta', delta: 'Hmm' },
      { type: 'text_delta', delta: 'Answer' },
      { type: 'done' },
    ]);
  });

  it('should map OpenAI 404 APIError to NotFoundException', async () => {
    const error = new OpenAI.APIError(
      404,
      { error: { message: 'Not found' } },
      'Not found',
      undefined,
    );
    mockCreate.mockRejectedValue(error);

    const generator = sut.stream({ message: 'Hi' });

    await expect(generator.next()).rejects.toThrow(NotFoundException);
  });

  it('should map OpenAI 400 APIError to BadRequestException', async () => {
    const error = new OpenAI.APIError(
      400,
      { error: { message: 'Bad request' } },
      'Bad request',
      undefined,
    );
    mockCreate.mockRejectedValue(error);

    const generator = sut.stream({ message: 'Hi' });

    await expect(generator.next()).rejects.toThrow(BadRequestException);
  });

  it('should map OpenAI 500 APIError to ServiceUnavailableException', async () => {
    const error = new OpenAI.APIError(
      500,
      { error: { message: 'Server error' } },
      'Server error',
      undefined,
    );
    mockCreate.mockRejectedValue(error);

    const generator = sut.stream({ message: 'Hi' });

    await expect(generator.next()).rejects.toThrow(ServiceUnavailableException);
  });

  it('should handle fetch errors gracefully', async () => {
    mockCreate.mockRejectedValue(new Error('Network error'));

    const generator = sut.stream({ message: 'Hi' });
    const events: ChatStreamEvent[] = [];

    for await (const event of generator) {
      events.push(event);
    }

    expect(events).toEqual([{ type: 'error', message: 'Network error' }]);
  });

  it('should pass correct payload to OpenAI client', async () => {
    mockCreate.mockResolvedValue(createMockStream([]));

    const generator = sut.stream({
      message: 'Hello',
      systemPrompt: 'You are helpful.',
    });

    await generator.next();

    expect(mockCreate).toHaveBeenCalledWith({
      model: '',
      messages: [
        { role: 'system', content: 'You are helpful.' },
        { role: 'user', content: 'Hello' },
      ],
      stream: true,
    });
  });
});
