import { Injectable } from '@nestjs/common';

import { ToolOutputGuard } from '../../application/ports/tool-output-guard';
import { Message } from '../../domain/value-objects/message';
import { MessageRole } from '../../domain/enums/message-role';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import { ToolResult } from '../../../tools/domain/value-objects/tool-result';
import { FREE_TEXT_FIELD_PATHS } from './free-text-field-map';
import { isInstructionShaped } from './instruction-shaped-patterns';

export type CustomerTextQuarantine = {
  authority: 'customer_text';
  instructional: false;
  instruction_shaped: boolean;
  text: string;
};

@Injectable()
export class DefaultToolOutputGuard implements ToolOutputGuard {
  project(call: ToolCall, result: ToolResult): Message {
    const paths = FREE_TEXT_FIELD_PATHS[result.toolName] ?? [];
    const data =
      paths.length > 0 && result.data !== undefined
        ? projectFreeTextFields(result.data, paths)
        : result.data;

    return {
      role: MessageRole.TOOL,
      content: JSON.stringify({
        success: result.success,
        trust: 'untrusted',
        channel: 'tool_data',
        authority: 'informational',
        toolName: result.toolName,
        data,
        error: result.error,
      }),
      metadata: {
        toolName: result.toolName,
        toolCallId: result.toolCallId ?? call.id,
        arguments: call.arguments,
      },
    };
  }
}

export function quarantineText(text: string): CustomerTextQuarantine {
  return {
    authority: 'customer_text',
    instructional: false,
    instruction_shaped: isInstructionShaped(text),
    text,
  };
}

/**
 * Walk allowlisted paths and wrap string leaves as customer_text quarantine.
 * Non-string leaves (null, numbers, etc.) and unlisted paths are unchanged.
 */
export function projectFreeTextFields(
  data: unknown,
  paths: readonly string[],
): unknown {
  let current = data;
  for (const path of paths) {
    current = quarantineAtPath(current, path.split('.'));
  }
  return current;
}

function quarantineAtPath(value: unknown, segments: string[]): unknown {
  if (segments.length === 0 || value === null || typeof value !== 'object') {
    return value;
  }

  const [head, ...rest] = segments;
  if (head === undefined) {
    return value;
  }

  const isArraySegment = head.endsWith('[]');
  const key = isArraySegment ? head.slice(0, -2) : head;

  if (Array.isArray(value)) {
    return value;
  }

  const obj = value as Record<string, unknown>;
  if (!(key in obj)) {
    return value;
  }

  if (isArraySegment) {
    const arr = obj[key];
    if (!Array.isArray(arr)) {
      return value;
    }
    return {
      ...obj,
      [key]: arr.map((item) => quarantineAtPath(item, rest)),
    };
  }

  if (rest.length === 0) {
    const leaf = obj[key];
    if (typeof leaf !== 'string') {
      return value;
    }
    return {
      ...obj,
      [key]: quarantineText(leaf),
    };
  }

  return {
    ...obj,
    [key]: quarantineAtPath(obj[key], rest),
  };
}
