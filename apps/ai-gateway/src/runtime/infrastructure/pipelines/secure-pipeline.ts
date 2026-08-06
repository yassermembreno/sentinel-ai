import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { ChatPipeline } from '../../application/ports/chat-pipeline';
import { ExecutionPolicy } from '../../application/ports/execution-policy';
import { EXECUTION_POLICY } from '../../application/ports/execution-policy.token';
import { ToolExecutionPolicy } from '../../application/ports/tool-execution-policy';
import { TOOL_EXECUTION_POLICY } from '../../application/ports/tool-execution-policy.token';
import { LLMResolver } from '../../../llm/application/ports/llm-resolver';
import { LLM_RESOLVER } from '../../../llm/application/ports/llm-resolver.token';
import { OllamaMapper } from '../../../llm/infrastructure/ollama/mapper/ollama-mapper';
import { ToolExecutor } from '../../../tools/application/ports/tool-executor';
import { TOOL_EXECUTOR } from '../../../tools/application/ports/tool-executor.token';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';
import { toPolicyToolResult } from './to-policy-tool-result';

@Injectable()
export class SecurePipeline implements ChatPipeline {
  constructor(
    @Inject(LLM_RESOLVER)
    private readonly llmResolver: LLMResolver,
    @Inject(TOOL_EXECUTOR)
    private readonly toolExecutor: ToolExecutor,
    @Inject(EXECUTION_POLICY)
    private readonly executionPolicy: ExecutionPolicy,
    @Inject(TOOL_EXECUTION_POLICY)
    private readonly toolExecutionPolicy: ToolExecutionPolicy,
    private readonly ollamaMapper: OllamaMapper,
  ) {}

  async execute(execution: Execution): Promise<Execution> {
    let current: Execution = {
      ...execution,
      toolCalls: execution.toolCalls ?? [],
      messages: [...execution.messages],
    };

    let iteration = 0;

    while (true) {
      const llm = this.llmResolver.resolve(current);
      const response = await llm.generate(current);

      current = {
        ...current,
        messages: [...current.messages, ...response.messages],
        toolCalls: response.toolCalls,
      };

      if (response.toolCalls.length === 0) {
        break;
      }

      if (
        !this.executionPolicy.shouldContinue(current, response, { iteration })
      ) {
        break;
      }

      iteration += 1;

      const results: ToolResult[] = [];
      for (const call of response.toolCalls) {
        const decision = this.toolExecutionPolicy.canExecute(call, current);

        if (decision.status !== 'ALLOW') {
          results.push(toPolicyToolResult(call, decision));
          continue;
        }

        results.push(await this.toolExecutor.execute(call));
      }

      const toolMessages = response.toolCalls.map((call, index) => {
        const result = results[index];
        if (!result) {
          throw new Error(`Missing tool result for call '${call.toolName}'`);
        }
        return this.ollamaMapper.toToolMessage(call, result);
      });

      current = {
        ...current,
        messages: [...current.messages, ...toolMessages],
      };
    }

    return current;
  }
}
