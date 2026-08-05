import { Module } from "@nestjs/common";
import { VulnerablePipeline } from "./infrastructure/pipelines/vulnerable-pipeline";
import { LlmModule } from "../llm/llm.module";
import { ToolsModule } from "../tools/tools.module";
import { AiRuntimeService } from "./application/services/ai-runtime.service";
import { PIPELINE_RESOLVER } from "./application/ports/pipeline-resolver.token";
import { CHAT_PIPELINE } from "./application/ports/chat-pipeline.token";
import { DefaultPipelineResolver } from "./infrastructure/resolvers/default-pipeline-resolver";

@Module({
  imports: [
    LlmModule,
    ToolsModule,
  ],
  providers: [
    AiRuntimeService,
    {
      provide: CHAT_PIPELINE,
      useClass: VulnerablePipeline,
    },
    {
      provide: PIPELINE_RESOLVER,
      useClass: DefaultPipelineResolver,
    },
  ],
  exports: [
    AiRuntimeService,
    CHAT_PIPELINE,
    PIPELINE_RESOLVER,
  ],
})
export class RuntimeModule {}