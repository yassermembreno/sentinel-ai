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
        reason: 'Operational action requires authorization',
      };
    }

    return {
      status: 'REQUIRE_APPROVAL',
      reason: 'Financial operation requires approval',
      pendingAction: {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    };
  }
}
