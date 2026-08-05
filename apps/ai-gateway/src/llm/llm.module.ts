import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { OLLAMA_OPTIONS } from "./infrastructure/ollama/options/ollama.options.token";
import { OllamaProvider } from "./infrastructure/ollama/ollama-provider";
import { OllamaMapper } from "./infrastructure/ollama/mapper/ollama-mapper";
import { OllamaClient } from "./infrastructure/ollama/client/ollama-client";
import { ToolsModule } from "../tools/tools.module";
import { LLM_PROVIDER } from "./application/ports/llm-provider.token";

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
    {
      provide: LLM_PROVIDER,
      useExisting: OllamaProvider,
    },
    {
      provide: OLLAMA_OPTIONS,
      useFactory: (configService: ConfigService) => ({
        baseUrl: configService.getOrThrow<string>('OLLAMA_BASE_URL'),
        model: configService.getOrThrow<string>('OLLAMA_MODEL'),
      }),
      inject: [ConfigService],
    },    
  ],
  exports: [
    LLM_PROVIDER,
    OLLAMA_OPTIONS,
  ],
})
export class LlmModule {}