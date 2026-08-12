import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { MessageRole } from '../../domain/enums/message-role';
import { PipelineResolver } from '../ports/pipeline-resolver';
import { PIPELINE_RESOLVER } from '../ports/pipeline-resolver.token';
import { AGENT_SYSTEM_PROMPT } from '../prompts/agent-system.prompt';

@Injectable()
export class AiRuntimeService {
  constructor(
    @Inject(PIPELINE_RESOLVER)
    private readonly pipelineResolver: PipelineResolver,
  ) {}

  async execute(execution: Execution): Promise<Execution> {
    const withSystem = this.ensureSystemPrompt(execution);
    const pipeline = await this.pipelineResolver.resolve(withSystem);
    return await pipeline.execute(withSystem);
  }

  private ensureSystemPrompt(execution: Execution): Execution {
    const hasSystem = execution.messages.some(
      (message) => message.role === MessageRole.SYSTEM,
    );

    if (hasSystem) {
      return execution;
    }

    return {
      ...execution,
      messages: [
        {
          role: MessageRole.SYSTEM,
          content: AGENT_SYSTEM_PROMPT,
        },
        ...execution.messages,
      ],
    };
  }
}
