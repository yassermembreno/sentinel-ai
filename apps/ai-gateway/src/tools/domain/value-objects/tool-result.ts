export interface ToolResult {
  toolCallId?: string;
  toolName: string;
  success: boolean;
  data: unknown;
}
