import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/common/configs/env.schema';
import { ILlmPort } from '../../application/ports/llm.port';
import { GroqAdapter } from '../adapters/groq.adapter';
import { LlamacppAdapter } from '../adapters/llamacpp.adapter';

@Injectable()
export class LlmAdapterFactory {
  private readonly adapters: Record<
    string,
    new (config: ConfigService<Env, true>) => ILlmPort
  > = {
    llama: LlamacppAdapter,
    groq: GroqAdapter,
  };

  constructor(private readonly configService: ConfigService<Env, true>) {}

  create(): ILlmPort {
    const provider = this.configService.get('LLM_PROVIDER', { infer: true });
    const AdapterClass = this.adapters[provider];

    if (!AdapterClass) {
      throw new Error(
        `Unknown LLM_PROVIDER: "${provider}". Supported values: ${Object.keys(this.adapters).join(', ')}`,
      );
    }

    return new AdapterClass(this.configService);
  }
}
