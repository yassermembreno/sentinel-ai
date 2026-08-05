import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { ChatPipeline } from '../../application/ports/chat-pipeline';
import { LLMProvider } from '../../../llm/application/ports/llm-provider';
import { LLM_PROVIDER } from '../../../llm/application/ports/llm-provider.token';

@Injectable()
export class VulnerablePipeline implements ChatPipeline {
  constructor(
    @Inject(LLM_PROVIDER)
    private readonly llmProvider: LLMProvider,    
  ) {}

  async execute(execution: Execution): Promise<Execution> {
    const response = await this.llmProvider.generate(execution);
    return {
      ...execution,
      messages: [...execution.messages, ...response.messages],
    };
  }
}