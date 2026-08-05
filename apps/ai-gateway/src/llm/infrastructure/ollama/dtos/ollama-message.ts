import { MessageRole } from '../../../../runtime/domain/enums/message-role';
import { OllamaTool } from './ollama-tool';

export interface OllamaMessage {
  role: MessageRole;
  content: string;
  tool_calls?: OllamaTool[];
  tool_name?: string;
}