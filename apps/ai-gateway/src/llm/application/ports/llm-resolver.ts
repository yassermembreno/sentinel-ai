import { Execution } from '../../../runtime/domain/entities/execution';
import { LLMProvider } from './llm-provider';

export interface LLMResolver {
  resolve(execution?: Execution): LLMProvider;
}
