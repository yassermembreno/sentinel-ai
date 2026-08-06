import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import { ToolExecutionDecision } from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';
import {
  CREDIT_POLICY_OPTIONS,
  CreditPolicyOptions,
} from './credit-policy.options';

@Injectable()
export class ApplyCreditPolicy implements ToolSecurityPolicy {
  readonly tool = 'apply_credit';

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
      return {
        status: 'DENY',
        reason: 'Invalid credit amount',
      };
    }

    if (amount <= this.options.autonomousLimitUsd) {
      return { status: 'ALLOW' };
    }

    return {
      status: 'REQUIRE_APPROVAL',
      reason: 'Credit exceeds autonomous limit',
      pendingAction: {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    };
  }
}
