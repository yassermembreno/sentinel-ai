import { MessageRole } from '../enums/message-role.js';

export interface Message {
  role: MessageRole;
  content: string;
}