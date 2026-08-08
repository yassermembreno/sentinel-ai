import { Inject, Injectable, Logger } from '@nestjs/common';

import { LLMProvider } from '../../application/ports/llm-provider';
import { Execution } from '../../../runtime/domain/entities/execution';
import { MessageRole } from '../../../runtime/domain/enums/message-role';
import { LLMResponse } from '../../domain/value-objects/llm-response';

import { OllamaMapper } from './mapper/ollama-mapper';
import { OllamaClient } from './client/ollama-client';

import { ToolRegistry } from '../../../tools/application/ports/tool-registry';
import { TOOLS_REGISTRY } from '../../../tools/application/ports/tool-registry.token';

@Injectable()
export class OllamaProvider implements LLMProvider {
  private readonly logger = new Logger('OLLAMA CHAT');

  constructor(
    private readonly client: OllamaClient,
    private readonly mapper: OllamaMapper,

    @Inject(TOOLS_REGISTRY)
    private readonly toolRegistry: ToolRegistry,
  ) {}

  async generate(execution: Execution): Promise<LLMResponse> {
    const tools = [...this.toolRegistry.list()];
    const payload = this.mapper.toChatPayload(execution, tools);
    const iteration = execution.messages.filter(
      (message) => message.role === MessageRole.ASSISTANT,
    ).length;

    this.logger.log(
      JSON.stringify(
        {
          phase: 'request',
          executionId: execution.id,
          iteration,
          messages: payload.messages,
          tools: tools.map((tool) => tool.name),
        },
        null,
        2,
      ),
    );

    const response = await this.client.chat(payload);

    this.logger.log(
      JSON.stringify(
        {
          phase: 'response',
          executionId: execution.id,
          iteration,
          role: response.message.role,
          content: response.message.content,
          tool_calls: response.message.tool_calls ?? [],
        },
        null,
        2,
      ),
    );

    return this.mapper.toLlmResponse(response);
  }
}
