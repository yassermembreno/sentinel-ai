import { Message } from '../../runtime/domain/value-objects/message';
import { ChatTraceEntry } from './chat-trace';

export interface ChatResponseDto {
  executionId: string;
  sessionId: string;
  pipeline?: string;
  messages: Message[];
  trace: ChatTraceEntry[];
}
