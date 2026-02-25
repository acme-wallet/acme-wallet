import { ChatStreamUseCase } from './chat-stream.use-case';
import { ILlmProvider } from '../ports/llm.provider';
import { mock, MockProxy } from 'vitest-mock-extended';
import type { ChatStreamEvent } from '@repo/schemas';

// eslint-disable-next-line @typescript-eslint/require-await
async function* makeGenerator(
  events: ChatStreamEvent[],
): AsyncGenerator<ChatStreamEvent> {
  for (const event of events) {
    yield event;
  }
}

describe('ChatStreamUseCase', () => {
  let llmProvider: MockProxy<ILlmProvider>;
  let sut: ChatStreamUseCase;

  beforeEach(() => {
    llmProvider = mock<ILlmProvider>();
    sut = new ChatStreamUseCase(llmProvider);
  });

  it('should delegate stream to the llm provider', async () => {
    const events: ChatStreamEvent[] = [
      { type: 'text_delta', delta: 'Hello' },
      { type: 'done' },
    ];
    llmProvider.stream.mockReturnValue(makeGenerator(events));

    const input = { message: 'Hi', systemPrompt: undefined, model: undefined };
    const generator = sut.execute(input);
    const collected: ChatStreamEvent[] = [];

    for await (const event of generator) {
      collected.push(event);
    }

    expect(llmProvider.stream).toHaveBeenCalledWith(input);
    expect(llmProvider.stream).toHaveBeenCalledTimes(1);
    expect(collected).toEqual(events);
  });

  it('should propagate reasoning_delta events', async () => {
    const events: ChatStreamEvent[] = [
      { type: 'reasoning_delta', delta: 'thinking...' },
      { type: 'text_delta', delta: 'answer' },
      { type: 'done' },
    ];
    llmProvider.stream.mockReturnValue(makeGenerator(events));

    const generator = sut.execute({ message: 'Why?' });
    const collected: ChatStreamEvent[] = [];
    for await (const event of generator) {
      collected.push(event);
    }

    expect(collected).toEqual(events);
  });

  it('should propagate error events from the provider', async () => {
    const events: ChatStreamEvent[] = [
      { type: 'error', message: 'LLM unavailable' },
    ];
    llmProvider.stream.mockReturnValue(makeGenerator(events));

    const generator = sut.execute({ message: 'Hello' });
    const collected: ChatStreamEvent[] = [];
    for await (const event of generator) {
      collected.push(event);
    }

    expect(collected[0]).toEqual({ type: 'error', message: 'LLM unavailable' });
  });
});
