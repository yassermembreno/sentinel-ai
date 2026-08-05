import { MessageRole } from '../enums/message-role';

export interface MessageMetadata {
  toolName?: string;
  toolCallId?: string;
  arguments?: Record<string, unknown>;
}

export interface Message {
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}
