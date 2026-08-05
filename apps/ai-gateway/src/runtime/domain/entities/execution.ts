import { Message } from '../value-objects/message';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';

export interface Execution {
  id: string;
  sessionId: string;
  messages: Message[];
  /** Última solicitud de herramientas emitida por el modelo. */
  toolCalls: ToolCall[];
}
