import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { OLLAMA_OPTIONS } from './infrastructure/ollama/options/ollama.options.token';
import { OllamaProvider } from './infrastructure/ollama/ollama-provider';
import { OllamaMapper } from './infrastructure/ollama/mapper/ollama-mapper';
import { OllamaClient } from './infrastructure/ollama/client/ollama-client';
import { FakeLLMProvider } from './infrastructure/fake/provider/fake-llm-provider';
import { DefaultLLMProviderRegistry } from './infrastructure/default-llm-provider-registry';
import { DefaultLLMResolver } from './infrastructure/default-llm-resolver';
import { ToolsModule } from '../tools/tools.module';
import { LLM_PROVIDER_REGISTRY } from './application/ports/llm-provider-registry.token';
import { LLM_RESOLVER } from './application/ports/llm-resolver.token';
import { LLM_OPTIONS } from './application/options/llm.options.token';
import { LlmOptions } from './application/options/llm.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ToolsModule,
  ],
  providers: [
    OllamaClient,
    OllamaMapper,
    OllamaProvider,
    FakeLLMProvider,
    {
      provide: OLLAMA_OPTIONS,
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.getOrThrow<string>('OLLAMA_BASE_URL'),
        model: configService.getOrThrow<string>('OLLAMA_MODEL'),
      }),
      inject: [ConfigService],
    },
    {
      provide: LLM_OPTIONS,
      useFactory: (config: ConfigService): LlmOptions => ({
        providerId: config.get<string>('LLM_PROVIDER_ID') ?? 'ollama',
      }),
      inject: [ConfigService],
    },
    {
      provide: LLM_PROVIDER_REGISTRY,
      useFactory: (ollama: OllamaProvider, fake: FakeLLMProvider) =>
        new DefaultLLMProviderRegistry([
          { id: 'ollama', provider: ollama },
          { id: 'fake', provider: fake },
        ]),
      inject: [OllamaProvider, FakeLLMProvider],
    },
    {
      provide: LLM_RESOLVER,
      useClass: DefaultLLMResolver,
    },
  ],
  exports: [LLM_RESOLVER, LLM_PROVIDER_REGISTRY, LLM_OPTIONS],
})
export class LlmModule {}
