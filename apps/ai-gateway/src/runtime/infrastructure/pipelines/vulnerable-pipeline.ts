import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { ChatPipeline } from '../../application/ports/chat-pipeline';
import { LLMResolver } from '../../../llm/application/ports/llm-resolver';
import { LLM_RESOLVER } from '../../../llm/application/ports/llm-resolver.token';

@Injectable()
export class VulnerablePipeline implements ChatPipeline {
  constructor(
    @Inject(LLM_RESOLVER)
    private readonly llmResolver: LLMResolver,
  ) {}

  async execute(execution: Execution): Promise<Execution> {
    const llm = this.llmResolver.resolve(execution);
    const response = await llm.generate(execution);
    return {
      ...execution,
      messages: [...execution.messages, ...response.messages],
    };
  }
}
