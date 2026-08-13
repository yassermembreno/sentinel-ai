export const ToolErrorType = {
  EXECUTION_ERROR: 'EXECUTION_ERROR',
  POLICY_DENIED: 'POLICY_DENIED',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
} as const;

export type ToolErrorType =
  (typeof ToolErrorType)[keyof typeof ToolErrorType];

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
