export type PipelineId = 'vulnerable' | 'secure';

export type TracePolicy = 'DENIED' | 'REQUIRE_APPROVAL';
export type TraceExecution = 'EXECUTED' | 'ERROR';
export type TraceIntegrity = 'rewritten' | 'verified';

export interface ChatTraceEntry {
  label: string;
  toolName?: string;
  policy?: TracePolicy;
  execution?: TraceExecution;
  integrity?: TraceIntegrity;
  toolOutput?: {
    structuredKeys: string[];
    untrustedText: boolean;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata?: {
    toolName?: string;
    toolCallId?: string;
    arguments?: Record<string, unknown>;
    integrity?: TraceIntegrity;
    reason?: string;
  };
}

export interface ChatResponse {
  executionId: string;
  sessionId: string;
  pipeline?: string;
  messages: ChatMessage[];
  trace: ChatTraceEntry[];
}

export interface DemoResetResponse {
  tickets: { id: string; status: string }[];
  creditsDeleted: number;
}
