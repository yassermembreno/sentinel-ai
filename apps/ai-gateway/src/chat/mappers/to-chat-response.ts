import { Execution } from '../../runtime/domain/entities/execution';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { toChatTrace } from './to-chat-trace';

export function toChatResponse(execution: Execution): ChatResponseDto {
  return {
    executionId: execution.id,
    sessionId: execution.sessionId,
    pipeline: execution.pipelineId,
    messages: execution.messages,
    trace: toChatTrace(execution.messages),
  };
}
