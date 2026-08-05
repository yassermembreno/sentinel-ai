import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { LLMResponse } from '../../../llm/domain/value-objects/llm-response';
import {
  ExecutionPolicy,
  ExecutionPolicyContext,
} from '../../application/ports/execution-policy';
import { ExecutionPolicyOptions } from '../../application/options/execution-policy.options';
import { EXECUTION_POLICY_OPTIONS } from '../../application/options/execution-policy.options.token';

@Injectable()
export class DefaultExecutionPolicy implements ExecutionPolicy {
  constructor(
    @Inject(EXECUTION_POLICY_OPTIONS)
    private readonly options: ExecutionPolicyOptions,
  ) {}

  shouldContinue(
    _execution: Execution,
    _response: LLMResponse,
    context: ExecutionPolicyContext,
  ): boolean {
    return context.iteration < this.options.maxIterations;
  }
}
