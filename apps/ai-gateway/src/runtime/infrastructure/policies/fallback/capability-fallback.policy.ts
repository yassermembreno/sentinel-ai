import { Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import { ToolExecutionDecision } from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';

@Injectable()
export class CapabilityFallbackPolicy implements ToolSecurityPolicy {
  readonly tool = '*';

  evaluate(
    _execution: Execution,
    toolCall: ToolCall,
    toolDefinition: Tool,
  ): ToolExecutionDecision {
    if (toolDefinition.capability === 'read') {
      return { status: 'ALLOW' };
    }

    if (toolDefinition.capability === 'operational') {
      return {
        status: 'DENY',
        code: 'OPERATIONAL_ACTION_NOT_ALLOWED',
        reason:
          'Operational action is not permitted under the current governance policy',
      };
    }

    return {
      status: 'REQUIRE_APPROVAL',
      code: 'REFUND_REQUIRES_APPROVAL',
      reason: 'Financial operation requires human approval before execution',
      pendingAction: {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    };
  }
}
