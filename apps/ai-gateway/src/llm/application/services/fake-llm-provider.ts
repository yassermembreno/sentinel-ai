import { Injectable } from "@nestjs/common";
import { MessageRole } from "../../../runtime/domain/enums/message-role";
import { LLMResponse } from "../../domain/value-objects/llm-response";
import { LLMProvider } from "../ports/llm-provider";

@Injectable()
export class FakeLLMProvider implements LLMProvider {
  async generate(): Promise<LLMResponse> {
    return {
      messages: [{
        role: MessageRole.ASSISTANT,
        content: 'Hello from Sentinel AI!',
      }],
      toolCalls: [],
    };
  }
}