import { Execution } from "../../../../runtime/domain/entities/execution";
import { Tool } from "../../../../tools/application/ports/tool";
import { LLMResponse } from "../../../domain/value-objects/llm-response";
import { OllamaChatPayload } from "../dtos/ollama-chat-payload";
import { OllamaChatResponse } from "../dtos/ollama-chat-response";

export class OllamaMapper {
    toChatPayload(execution: Execution, tools: Tool[]): OllamaChatPayload{
        return {            
            messages: execution.messages.map(message => ({
                role: message.role,
                content: message.content,
            })),         
            stream: false,
            tools: tools.length > 0 ? tools.map(tool => ({
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters,
                },
            })) : undefined,
        };
    }

    toLlmResponse(response: OllamaChatResponse): LLMResponse{
        return {
            messages: [{
                role: response.message.role,
                content: response.message.content,
            }],
            toolCalls: []
        };
    }
}