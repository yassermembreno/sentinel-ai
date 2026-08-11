import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { VulnerablePipeline } from './infrastructure/pipelines/vulnerable-pipeline';
import { SecurePipeline } from './infrastructure/pipelines/secure-pipeline';
import { LlmModule } from '../llm/llm.module';
import { ToolsModule } from '../tools/tools.module';
import { AiRuntimeService } from './application/services/ai-runtime.service';
import { PIPELINE_RESOLVER } from './application/ports/pipeline-resolver.token';
import {
  SECURE_PIPELINE,
  VULNERABLE_PIPELINE,
} from './application/ports/pipeline.tokens';
import { EXECUTION_POLICY } from './application/ports/execution-policy.token';
import { EXECUTION_POLICY_OPTIONS } from './application/options/execution-policy.options.token';
import { ExecutionPolicyOptions } from './application/options/execution-policy.options';
import { PIPELINE_RESOLVER_OPTIONS } from './application/options/pipeline-resolver.options.token';
import { PipelineResolverOptions } from './application/options/pipeline-resolver.options';
import { TOOL_EXECUTION_POLICY } from './application/ports/tool-execution-policy.token';
import { DefaultPipelineResolver } from './infrastructure/resolvers/default-pipeline-resolver';
import { DefaultExecutionPolicy } from './infrastructure/policies/default-execution-policy';
import { CapabilityPolicyEngine } from './infrastructure/policies/capability-policy.engine';
import { ToolPolicyResolver } from './infrastructure/policies/tool-policy.resolver';
import { CapabilityFallbackPolicy } from './infrastructure/policies/fallback/capability-fallback.policy';
import { AgentSecurityLogger } from './infrastructure/policies/agent-security.logger';
import { ApplyCreditPolicy } from './infrastructure/policies/tools/apply-credit.policy';
import { IssueRefundPolicy } from './infrastructure/policies/tools/issue-refund.policy';
import { OperationalDenyPolicy } from './infrastructure/policies/tools/operational-deny.policy';
import {
  CREDIT_POLICY_OPTIONS,
  CreditPolicyOptions,
} from './infrastructure/policies/tools/credit-policy.options';
import { ACTION_EVIDENCE_RECORDER_FACTORY } from './application/ports/action-evidence-recorder.token';
import { FINAL_RESPONSE_INTEGRITY_POLICY } from './application/ports/final-response-integrity-policy.token';
import { DefaultActionEvidenceRecorderFactory } from './infrastructure/evidence/default-action-evidence-recorder';
import { DefaultFinalResponseIntegrityPolicy } from './infrastructure/integrity/default-final-response-integrity-policy';

@Module({
  imports: [LlmModule, ToolsModule],
  providers: [
    AiRuntimeService,
    VulnerablePipeline,
    SecurePipeline,
    {
      provide: VULNERABLE_PIPELINE,
      useExisting: VulnerablePipeline,
    },
    {
      provide: SECURE_PIPELINE,
      useExisting: SecurePipeline,
    },
    {
      provide: PIPELINE_RESOLVER_OPTIONS,
      useFactory: (config: ConfigService): PipelineResolverOptions => ({
        pipelineId: config.get<string>('PIPELINE_ID') ?? 'vulnerable',
      }),
      inject: [ConfigService],
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
    {
      provide: CREDIT_POLICY_OPTIONS,
      useFactory: (config: ConfigService): CreditPolicyOptions => ({
        autonomousLimitUsd: Number(
          config.get('CREDIT_AUTONOMOUS_LIMIT_USD') ?? 50,
        ),
      }),
      inject: [ConfigService],
    },
    AgentSecurityLogger,
    CapabilityFallbackPolicy,
    ApplyCreditPolicy,
    IssueRefundPolicy,
    OperationalDenyPolicy,
    ToolPolicyResolver,
    {
      provide: TOOL_EXECUTION_POLICY,
      useClass: CapabilityPolicyEngine,
    },
    {
      provide: ACTION_EVIDENCE_RECORDER_FACTORY,
      useClass: DefaultActionEvidenceRecorderFactory,
    },
    {
      provide: FINAL_RESPONSE_INTEGRITY_POLICY,
      useClass: DefaultFinalResponseIntegrityPolicy,
    },
  ],
  exports: [AiRuntimeService, PIPELINE_RESOLVER],
})
export class RuntimeModule {}
