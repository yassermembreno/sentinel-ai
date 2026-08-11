import { Injectable, Logger } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { ToolCapability } from '../../../tools/domain/enums/tool-capability';
import {
  isAllow,
  ToolExecutionDecision,
} from '../../application/ports/tool-execution-policy';

@Injectable()
export class AgentSecurityLogger {
  private readonly logger = new Logger('AGENT SECURITY');

  logDecision(params: {
    execution: Execution;
    toolCall: ToolCall;
    capability?: ToolCapability;
    decision: ToolExecutionDecision;
    extras?: Record<string, string | number>;
  }): void {
    const lines = [
      `executionId=${params.execution.id}`,
      `tool=${params.toolCall.toolName}`,
    ];

    if (params.capability) {
      lines.push(`capability=${params.capability}`);
    }

    lines.push(`decision=${params.decision.status}`);

    if (!isAllow(params.decision)) {
      lines.push(`reason="${params.decision.reason}"`);
    }

    if (params.extras) {
      for (const [key, value] of Object.entries(params.extras)) {
        lines.push(`${key}=${value}`);
      }
    }

    this.logger.warn(lines.join('\n'));
  }
}
