import { MessageRole } from '../../../../runtime/domain/enums/message-role';
import { OllamaToolCall } from './ollama-tool-call';

export interface OllamaMessage {
  role: MessageRole;
  content: string;
  tool_calls?: OllamaToolCall[];
  tool_name?: string;
}
