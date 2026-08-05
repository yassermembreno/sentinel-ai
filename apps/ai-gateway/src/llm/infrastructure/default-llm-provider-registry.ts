import {
  LLMProviderRegistry,
  RegisteredLLMProvider,
} from '../application/ports/llm-provider-registry';
import { LLMProvider } from '../application/ports/llm-provider';

export class DefaultLLMProviderRegistry implements LLMProviderRegistry {
  private readonly providers: Map<string, LLMProvider>;

  constructor(entries: RegisteredLLMProvider[]) {
    this.providers = new Map(
      entries.map((entry) => [entry.id, entry.provider]),
    );
  }

  get(id: string): LLMProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      const registered = [...this.providers.keys()]
        .map((registeredId) => `- ${registeredId}`)
        .join('\n');

      throw new Error(
        `Unknown LLM provider '${id}'.\n\nRegistered providers:\n${registered}`,
      );
    }
    return provider;
  }

  has(id: string): boolean {
    return this.providers.has(id);
  }

  list(): readonly RegisteredLLMProvider[] {
    return [...this.providers.entries()].map(([id, provider]) => ({
      id,
      provider,
    }));
  }
}
