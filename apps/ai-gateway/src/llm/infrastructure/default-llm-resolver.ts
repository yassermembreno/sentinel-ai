import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../runtime/domain/entities/execution';
import { LLMProvider } from '../application/ports/llm-provider';
import { LLMProviderRegistry } from '../application/ports/llm-provider-registry';
import { LLM_PROVIDER_REGISTRY } from '../application/ports/llm-provider-registry.token';
import { LLMResolver } from '../application/ports/llm-resolver';
import { LlmOptions } from '../application/options/llm.options';
import { LLM_OPTIONS } from '../application/options/llm.options.token';

@Injectable()
export class DefaultLLMResolver implements LLMResolver {
  constructor(
    @Inject(LLM_PROVIDER_REGISTRY)
    private readonly registry: LLMProviderRegistry,
    @Inject(LLM_OPTIONS)
    private readonly options: LlmOptions,
  ) {}

  resolve(_execution?: Execution): LLMProvider {
    return this.registry.get(this.options.providerId);
  }
}
