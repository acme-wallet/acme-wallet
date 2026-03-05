import { ConfigService } from '@nestjs/config';
import { Env } from 'src/common/configs/env.schema';
import { describe, expect, it, vi } from 'vitest';
import { GroqAdapter } from '../adapters/groq.adapter';
import { LlamacppAdapter } from '../adapters/llamacpp.adapter';
import { LlmAdapterFactory } from './llm-adapter.factory';

vi.mock('../adapters/llamacpp.adapter');
vi.mock('../adapters/groq.adapter');

function createConfigService(provider: string): ConfigService<Env, true> {
  return {
    get: vi.fn().mockReturnValue(provider),
  } as unknown as ConfigService<Env, true>;
}

describe('LlmAdapterFactory', () => {
  it('should create LlamacppAdapter when LLM_PROVIDER is "llama"', () => {
    const configService = createConfigService('llama');
    const factory = new LlmAdapterFactory(configService);

    expect(factory.create()).toBeInstanceOf(LlamacppAdapter);
  });

  it('should create GroqAdapter when LLM_PROVIDER is "groq"', () => {
    const configService = createConfigService('groq');
    const factory = new LlmAdapterFactory(configService);

    expect(factory.create()).toBeInstanceOf(GroqAdapter);
  });

  it('should throw an error for an unknown provider', () => {
    const configService = createConfigService('unknown');
    const factory = new LlmAdapterFactory(configService);

    expect(() => factory.create()).toThrow('Unknown LLM_PROVIDER: "unknown"');
  });
});
