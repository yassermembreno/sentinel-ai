import { ChatPipeline } from './chat-pipeline';
import { Execution } from '../../domain/entities/execution';

export interface PipelineResolver {
  resolve(execution: Execution): Promise<ChatPipeline>;
}
