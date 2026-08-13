import { Message } from '../../runtime/domain/value-objects/message';
import { MessageRole } from '../../runtime/domain/enums/message-role';
import { ToolErrorType } from '../../tools/domain/value-objects/tool-result';
import {
  ChatTraceEntry,
  TraceExecution,
  TraceIntegrity,
  TracePolicy,
} from '../dto/chat-trace';

type ToolPayload = {
  success?: boolean;
  toolName?: string;
  data?: unknown;
  error?: { type?: string; message?: string };
};

export function toChatTrace(messages: Message[]): ChatTraceEntry[] {
  const entries: ChatTraceEntry[] = [];

  for (const message of messages) {
    if (message.role === MessageRole.TOOL) {
      entries.push(...projectToolMessage(message));
      continue;
    }

    if (message.role === MessageRole.ASSISTANT) {
      const integrity = projectAssistantIntegrity(message);
      if (integrity) {
        entries.push(integrity);
      }
    }
  }

  return entries;
}

function projectToolMessage(message: Message): ChatTraceEntry[] {
  const payload = parseToolPayload(message.content);
  const toolName = message.metadata?.toolName ?? payload?.toolName ?? 'unknown';
  const label = toToolLabel(toolName);
  const entries: ChatTraceEntry[] = [];

  const errorType = payload?.error?.type;
  if (errorType === ToolErrorType.POLICY_DENIED) {
    entries.push({ label, toolName, policy: TracePolicy.DENIED });
  } else if (errorType === ToolErrorType.APPROVAL_REQUIRED) {
    entries.push({
      label,
      toolName,
      policy: TracePolicy.REQUIRE_APPROVAL,
    });
  } else if (errorType === ToolErrorType.EXECUTION_ERROR) {
    entries.push({ label, toolName, execution: TraceExecution.ERROR });
  } else if (payload?.success === true) {
    entries.push({ label, toolName, execution: TraceExecution.EXECUTED });
  }

  const toolOutput = summarizeLayerA(payload?.data);
  if (toolOutput) {
    entries.push({
      label: 'TOOL OUTPUT',
      toolName,
      toolOutput,
    });
  }

  return entries;
}

function projectAssistantIntegrity(
  message: Message,
): ChatTraceEntry | undefined {
  if (message.metadata?.integrity === 'rewritten') {
    return { label: 'RESPONSE', integrity: TraceIntegrity.REWRITTEN };
  }

  if (message.metadata?.integrity === 'verified') {
    return { label: 'RESPONSE', integrity: TraceIntegrity.VERIFIED };
  }

  return undefined;
}

function parseToolPayload(content: string): ToolPayload | undefined {
  try {
    const parsed: unknown = JSON.parse(content);
    if (parsed && typeof parsed === 'object') {
      return parsed as ToolPayload;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function toToolLabel(toolName: string): string {
  return toolName.replaceAll('_', ' ').toUpperCase();
}

function isCustomerText(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { authority?: unknown }).authority === 'customer_text'
  );
}

function summarizeLayerA(
  data: unknown,
): { structuredKeys: string[]; untrustedText: boolean } | undefined {
  if (data === undefined) {
    return undefined;
  }

  const structuredKeys: string[] = [];
  let untrustedText = false;

  const walk = (value: unknown, path: string): void => {
    if (isCustomerText(value)) {
      untrustedText = true;
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        walk(item, path ? `${path}[${index}]` : `[${index}]`);
      });
      return;
    }

    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        const next = path ? `${path}.${key}` : key;
        if (isCustomerText(child)) {
          untrustedText = true;
        } else if (child && typeof child === 'object') {
          walk(child, next);
        } else {
          structuredKeys.push(next);
        }
      }
    }
  };

  walk(data, '');

  if (!untrustedText) {
    return undefined;
  }

  return { structuredKeys, untrustedText };
}
