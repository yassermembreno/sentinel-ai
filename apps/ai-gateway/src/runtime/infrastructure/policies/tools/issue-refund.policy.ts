import { Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import {
  requireApprovalDecision,
  ToolExecutionDecision,
} from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';
import { MutatingToolName } from '../../../domain/enums/mutating-tool-name';

@Injectable()
export class IssueRefundPolicy implements ToolSecurityPolicy {
  readonly tool = MutatingToolName.ISSUE_REFUND;

  evaluate(
    _execution: Execution,
    toolCall: ToolCall,
    _toolDefinition: Tool,
  ): ToolExecutionDecision {
    return requireApprovalDecision(
      'REFUND_REQUIRES_APPROVAL',
      'Refund requires human approval before execution',
      {
        tool: toolCall.toolName,
        arguments: toolCall.arguments,
      },
    );
  }
}
