import { Message } from '../../runtime/domain/value-objects/message';

export interface ChatResponseDto {
  executionId: string;
  sessionId: string;
  messages: Message[];
}
