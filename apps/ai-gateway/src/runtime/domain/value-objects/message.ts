import { IntegrityRewriteReason } from '../enums/integrity-rewrite-reason';
import { MessageRole } from '../enums/message-role';

export interface MessageMetadata {
  toolName?: string;
  toolCallId?: string;
  arguments?: Record<string, unknown>;
  /** Layer C: set when FinalResponseIntegrityPolicy rewrites the assistant message. */
  integrity?: 'rewritten' | 'verified';
  reason?: IntegrityRewriteReason;
}

export interface Message {
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}
