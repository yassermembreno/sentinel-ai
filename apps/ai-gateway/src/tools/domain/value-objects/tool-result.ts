export interface ToolResult {
    toolCallId?: string;
    success: boolean;
    data: Record<string, unknown>;
}