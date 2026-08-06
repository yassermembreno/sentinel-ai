import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { Tool } from '../../../tools/application/ports/tool';
import { Execution } from '../../domain/entities/execution';
import { ToolExecutionDecision } from '../../application/ports/tool-execution-policy';

export interface ToolSecurityPolicy {
  readonly tool: string;

  evaluate(
    execution: Execution,
    toolCall: ToolCall,
    toolDefinition: Tool,
  ): ToolExecutionDecision;
}
