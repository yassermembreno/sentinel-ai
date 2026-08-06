import { ToolCall } from '../../domain/value-objects/tool-call';
import { ToolResult } from '../../domain/value-objects/tool-result';
import { ToolCapability } from '../../domain/enums/tool-capability';

export interface Tool {
  readonly name: string;
  readonly description: string;
  readonly parameters: Record<string, unknown>;
  readonly capability: ToolCapability;

  execute(call: ToolCall): Promise<ToolResult>;
}
