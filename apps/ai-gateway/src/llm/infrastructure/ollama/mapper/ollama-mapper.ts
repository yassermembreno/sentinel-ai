import { Injectable } from '@nestjs/common';

import { Execution } from '../../../../runtime/domain/entities/execution';
import { Message } from '../../../../runtime/domain/value-objects/message';
import { MessageRole } from '../../../../runtime/domain/enums/message-role';
import { Tool } from '../../../../tools/application/ports/tool';
import { ToolCall } from '../../../../tools/domain/value-objects/tool-call';
import { ToolResult } from '../../../../tools/domain/value-objects/tool-result';
import { LLMResponse } from '../../../domain/value-objects/llm-response';
import { OllamaChatPayload } from '../dtos/ollama-chat-payload';
import { OllamaChatResponse } from '../dtos/ollama-chat-response';
import { OllamaMessage } from '../dtos/ollama-message';
import { OllamaToolCall } from '../dtos/ollama-tool-call';

@Injectable()
export class OllamaMapper {
  toChatPayload(execution: Execution, tools: Tool[]): OllamaChatPayload {
    return {
      messages: this.toOllamaMessages(execution.messages),
      stream: false,
      tools:
        tools.length > 0
          ? tools.map((tool) => ({
              type: 'function' as const,
              function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
              },
            }))
          : undefined,
    };
  }

  toLlmResponse(response: OllamaChatResponse): LLMResponse {
    const toolCalls = (response.message.tool_calls ?? []).map((call) =>
      this.toToolCall(call),
    );

    return {
      messages: [
        {
          role: response.message.role,
          content: response.message.content ?? '',
        },
      ],
      toolCalls,
    };
  }

  toToolMessage(call: ToolCall, result: ToolResult): Message {
    return {
      role: MessageRole.TOOL,
      content: JSON.stringify({
        success: result.success,
        data: result.data,
        error: result.error,
      }),
      metadata: {
        toolName: result.toolName,
        toolCallId: result.toolCallId ?? call.id,
        arguments: call.arguments,
      },
    };
  }

  private toOllamaMessages(messages: Message[]): OllamaMessage[] {
    const result: OllamaMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (!message) {
        continue;
      }

      result.push(this.toOllamaMessage(message, messages, i));
    }

    return result;
  }

  private toOllamaMessage(
    message: Message,
    messages: Message[],
    index: number,
  ): OllamaMessage {
    if (message.role === MessageRole.TOOL) {
      return this.toOllamaToolMessage(message);
    }

    if (message.role === MessageRole.ASSISTANT) {
      return this.toOllamaAssistantMessage(message, messages, index);
    }

    return {
      role: message.role,
      content: message.content,
    };
  }

  private toOllamaToolMessage(message: Message): OllamaMessage {
    return {
      role: MessageRole.TOOL,
      content: message.content,
      tool_name: message.metadata?.toolName,
    };
  }

  private toOllamaAssistantMessage(
    message: Message,
    messages: Message[],
    index: number,
  ): OllamaMessage {
    const followingTools = this.collectFollowingToolMessages(messages, index + 1);
    const ollamaMessage: OllamaMessage = {
      role: MessageRole.ASSISTANT,
      content: message.content,
    };

    if (followingTools.length > 0) {
      ollamaMessage.tool_calls = followingTools.map((toolMessage) =>
        this.toOllamaToolCallFromMetadata(toolMessage),
      );
    }

    return ollamaMessage;
  }

  private collectFollowingToolMessages(
    messages: Message[],
    startIndex: number,
  ): Message[] {
    const followingTools: Message[] = [];

    for (let j = startIndex; j < messages.length; j++) {
      const next = messages[j];
      if (next?.role !== MessageRole.TOOL) {
        break;
      }
      followingTools.push(next);
    }

    return followingTools;
  }

  private toToolCall(call: OllamaToolCall): ToolCall {
    return {
      toolName: call.function.name,
      arguments: call.function.arguments ?? {},
    };
  }

  private toOllamaToolCallFromMetadata(toolMessage: Message): OllamaToolCall {
    return {
      function: {
        name: toolMessage.metadata?.toolName ?? '',
        arguments: toolMessage.metadata?.arguments ?? {},
      },
    };
  }
}
