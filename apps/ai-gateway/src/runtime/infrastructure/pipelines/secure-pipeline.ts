import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { MessageRole } from '../../domain/enums/message-role';
import { ChatPipeline } from '../../application/ports/chat-pipeline';
import { ExecutionPolicy } from '../../application/ports/execution-policy';
import { EXECUTION_POLICY } from '../../application/ports/execution-policy.token';
import { TOOL_EXECUTION_POLICY } from '../../application/ports/tool-execution-policy.token';
import { ActionEvidenceRecorderFactory } from '../../application/ports/action-evidence-recorder';
import { ACTION_EVIDENCE_RECORDER_FACTORY } from '../../application/ports/action-evidence-recorder.token';
import { FinalResponseIntegrityPolicy } from '../../application/ports/final-response-integrity-policy';
import { FINAL_RESPONSE_INTEGRITY_POLICY } from '../../application/ports/final-response-integrity-policy.token';
import { LLMResolver } from '../../../llm/application/ports/llm-resolver';
import { LLM_RESOLVER } from '../../../llm/application/ports/llm-resolver.token';
import { ToolExecutor } from '../../../tools/application/ports/tool-executor';
import { TOOL_EXECUTOR } from '../../../tools/application/ports/tool-executor.token';
import { ToolRegistry } from '../../../tools/application/ports/tool-registry';
import { TOOLS_REGISTRY } from '../../../tools/application/ports/tool-registry.token';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';
import { isAllow, ToolExecutionPolicy } from '../../application/ports/tool-execution-policy';
import { toPolicyToolResult } from './to-policy-tool-result';
import { toUntrustedToolMessage } from './to-untrusted-tool-message';

@Injectable()
export class SecurePipeline implements ChatPipeline {
  constructor(
    @Inject(LLM_RESOLVER)
    private readonly llmResolver: LLMResolver,
    @Inject(TOOL_EXECUTOR)
    private readonly toolExecutor: ToolExecutor,
    @Inject(TOOLS_REGISTRY)
    private readonly toolRegistry: ToolRegistry,
    @Inject(EXECUTION_POLICY)
    private readonly executionPolicy: ExecutionPolicy,
    @Inject(TOOL_EXECUTION_POLICY)
    private readonly toolExecutionPolicy: ToolExecutionPolicy,
    @Inject(ACTION_EVIDENCE_RECORDER_FACTORY)
    private readonly evidenceRecorderFactory: ActionEvidenceRecorderFactory,
    @Inject(FINAL_RESPONSE_INTEGRITY_POLICY)
    private readonly responseIntegrity: FinalResponseIntegrityPolicy,
  ) {}

  async execute(execution: Execution): Promise<Execution> {
    let current: Execution = {
      ...execution,
      toolCalls: execution.toolCalls ?? [],
      messages: [...execution.messages],
    };

    let iteration = 0;
    const evidence = this.evidenceRecorderFactory.create();

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
        const capability = this.toolRegistry.get(call.toolName).capability;

        if (!isAllow(decision)) {
          const policyResult = toPolicyToolResult(call, decision);
          evidence.record({
            toolCall: call,
            capability,
            decision,
            result: policyResult,
          });
          results.push(policyResult);
          continue;
        }

        const executed = await this.toolExecutor.execute(call);
        evidence.record({
          toolCall: call,
          capability,
          decision,
          result: executed,
        });
        results.push(executed);
      }

      const toolMessages = response.toolCalls.map((call, index) => {
        const result = results[index];
        if (!result) {
          throw new Error(`Missing tool result for call '${call.toolName}'`);
        }
        return toUntrustedToolMessage(call, result);
      });

      current = {
        ...current,
        messages: [...current.messages, ...toolMessages],
      };
    }

    return this.applyResponseIntegrity(current, evidence);
  }

  private applyResponseIntegrity(
    current: Execution,
    evidence: ReturnType<ActionEvidenceRecorderFactory['create']>,
  ): Execution {
    const lastIndex = current.messages.length - 1;
    if (lastIndex < 0) {
      return current;
    }

    const last = current.messages[lastIndex];
    if (last?.role !== MessageRole.ASSISTANT) {
      return current;
    }

    const integrity = this.responseIntegrity.apply(last, evidence);
    if (!integrity.rewritten) {
      return current;
    }

    const messages = [...current.messages];
    messages[lastIndex] = integrity.message;
    return { ...current, messages };
  }
}
