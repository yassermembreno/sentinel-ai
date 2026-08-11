import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import {
  allowDecision,
  denyDecision,
  requireApprovalDecision,
  ToolExecutionDecision,
} from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';
import { MutatingToolName } from '../../../domain/enums/mutating-tool-name';
import {
  CREDIT_POLICY_OPTIONS,
  CreditPolicyOptions,
} from './credit-policy.options';

@Injectable()
export class ApplyCreditPolicy implements ToolSecurityPolicy {
  readonly tool = MutatingToolName.APPLY_CREDIT;

  constructor(
    @Inject(CREDIT_POLICY_OPTIONS)
    private readonly options: CreditPolicyOptions,
  ) {}

  evaluate(
    _execution: Execution,
    toolCall: ToolCall,
    _toolDefinition: Tool,
  ): ToolExecutionDecision {
    const amount = Number(toolCall.arguments['amount']);

    if (!Number.isFinite(amount) || amount <= 0) {
      return denyDecision('INVALID_CREDIT_AMOUNT', 'Invalid credit amount');
    }

    if (amount <= this.options.autonomousLimitUsd) {
      return allowDecision();
    }

    return requireApprovalDecision(
      'AUTONOMOUS_LIMIT_EXCEEDED',
      `Credit of $${amount} exceeds autonomous limit of $${this.options.autonomousLimitUsd} USD`,
      {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    );
  }
}
