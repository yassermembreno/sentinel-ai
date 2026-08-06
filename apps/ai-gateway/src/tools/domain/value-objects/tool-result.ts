export type ToolErrorType =
  | 'EXECUTION_ERROR'
  | 'POLICY_DENIED'
  | 'APPROVAL_REQUIRED';

export type ToolError = {
  type: ToolErrorType;
  message: string;
};

export interface ToolResult {
  toolCallId?: string;
  toolName: string;
  success: boolean;
  data?: unknown;
  error?: ToolError;
}
