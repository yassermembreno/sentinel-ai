import { Injectable } from '@nestjs/common';

import { Execution } from '../../../domain/entities/execution';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../../tools/application/ports/tool';
import {
  denyDecision,
  ToolExecutionDecision,
} from '../../../application/ports/tool-execution-policy';
import { ToolSecurityPolicy } from '../../../application/ports/tool-security-policy';

@Injectable()
export class OperationalDenyPolicy implements ToolSecurityPolicy {
  readonly tool = 'operational';

  evaluate(
    _execution: Execution,
    _toolCall: ToolCall,
    _toolDefinition: Tool,
  ): ToolExecutionDecision {
    return denyDecision(
      'OPERATIONAL_ACTION_NOT_ALLOWED',
      'Operational action is not permitted under the current governance policy',
    );
  }
}
