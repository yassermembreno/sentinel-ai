import { LLMProvider } from './llm-provider';

export interface RegisteredLLMProvider {
  readonly id: string;
  readonly provider: LLMProvider;
}

export interface LLMProviderRegistry {
  get(id: string): LLMProvider;
  has(id: string): boolean;
  list(): readonly RegisteredLLMProvider[];
}
