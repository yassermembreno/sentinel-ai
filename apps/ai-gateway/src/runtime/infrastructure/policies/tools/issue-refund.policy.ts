import { Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import { ToolExecutionDecision } from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';

@Injectable()
export class IssueRefundPolicy implements ToolSecurityPolicy {
  readonly tool = 'issue_refund';

  evaluate(
    _execution: Execution,
    toolCall: ToolCall,
    _toolDefinition: Tool,
  ): ToolExecutionDecision {
    return {
      status: 'REQUIRE_APPROVAL',
      code: 'REFUND_REQUIRES_APPROVAL',
      reason: 'Refund requires human approval before execution',
      pendingAction: {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    };
  }
}
