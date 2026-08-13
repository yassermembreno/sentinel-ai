import { Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import { ToolCapability } from '../../../../tools/domain/enums/tool-capability';
import {
  allowDecision,
  denyDecision,
  requireApprovalDecision,
  ToolExecutionDecision,
} from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';

@Injectable()
export class CapabilityFallbackPolicy implements ToolSecurityPolicy {
  readonly tool = '*';

  evaluate(
    _execution: Execution,
    toolCall: ToolCall,
    toolDefinition: Tool,
  ): ToolExecutionDecision {
    if (toolDefinition.capability === ToolCapability.READ) {
      return allowDecision();
    }

    if (toolDefinition.capability === ToolCapability.OPERATIONAL) {
      return denyDecision(
        'OPERATIONAL_ACTION_NOT_ALLOWED',
        'Operational action is not permitted under the current governance policy',
      );
    }

    return requireApprovalDecision(
      'REFUND_REQUIRES_APPROVAL',
      'Financial operation requires human approval before execution',
      {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    );
  }
}
