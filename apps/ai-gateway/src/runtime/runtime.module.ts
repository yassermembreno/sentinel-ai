import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { VulnerablePipeline } from './infrastructure/pipelines/vulnerable-pipeline';
import { LlmModule } from '../llm/llm.module';
import { ToolsModule } from '../tools/tools.module';
import { AiRuntimeService } from './application/services/ai-runtime.service';
import { PIPELINE_RESOLVER } from './application/ports/pipeline-resolver.token';
import { CHAT_PIPELINE } from './application/ports/chat-pipeline.token';
import { EXECUTION_POLICY } from './application/ports/execution-policy.token';
import { EXECUTION_POLICY_OPTIONS } from './application/options/execution-policy.options.token';
import { ExecutionPolicyOptions } from './application/options/execution-policy.options';
import { DefaultPipelineResolver } from './infrastructure/resolvers/default-pipeline-resolver';
import { DefaultExecutionPolicy } from './infrastructure/policies/default-execution-policy';

@Module({
  imports: [LlmModule, ToolsModule],
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
    {
      provide: EXECUTION_POLICY_OPTIONS,
      useFactory: (config: ConfigService): ExecutionPolicyOptions => ({
        maxIterations: Number(config.get('EXECUTION_MAX_ITERATIONS') ?? 5),
      }),
      inject: [ConfigService],
    },
    {
      provide: EXECUTION_POLICY,
      useClass: DefaultExecutionPolicy,
    },
  ],
  exports: [AiRuntimeService, CHAT_PIPELINE, PIPELINE_RESOLVER],
})
export class RuntimeModule {}
