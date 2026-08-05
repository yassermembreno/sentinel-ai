import { Execution } from '../../domain/entities/execution';
import { LLMResponse } from '../../../llm/domain/value-objects/llm-response';

export interface ExecutionPolicyContext {
  iteration: number;
}

export interface ExecutionPolicy {
  shouldContinue(
    execution: Execution,
    response: LLMResponse,
    context: ExecutionPolicyContext,
  ): boolean;
}
