import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import {
  ToolExecutionDecision,
  ToolExecutionPolicy,
} from '../../application/ports/tool-execution-policy';
import { TOOLS_REGISTRY } from '../../../tools/application/ports/tool-registry.token';
import { ToolRegistry } from '../../../tools/application/ports/tool-registry';
import { ToolPolicyResolver } from './tool-policy.resolver';
import { CapabilityFallbackPolicy } from './fallback/capability-fallback.policy';
import { AgentSecurityLogger } from './agent-security.logger';
import {
  CREDIT_POLICY_OPTIONS,
  CreditPolicyOptions,
} from './tools/credit-policy.options';

@Injectable()
export class CapabilityPolicyEngine implements ToolExecutionPolicy {
  constructor(
    @Inject(TOOLS_REGISTRY)
    private readonly toolRegistry: ToolRegistry,
    private readonly policyResolver: ToolPolicyResolver,
    private readonly fallbackPolicy: CapabilityFallbackPolicy,
    private readonly securityLogger: AgentSecurityLogger,
    @Inject(CREDIT_POLICY_OPTIONS)
    private readonly creditOptions: CreditPolicyOptions,
  ) {}

  canExecute(
    toolCall: ToolCall,
    execution: Execution,
  ): ToolExecutionDecision {
    if (!this.toolRegistry.has(toolCall.toolName)) {
      const decision: ToolExecutionDecision = {
        status: 'DENY',
        code: 'UNKNOWN_TOOL',
        reason: `Unknown tool '${toolCall.toolName}'`,
      };
      this.securityLogger.logDecision({
        execution,
        toolCall,
        decision,
      });
      return decision;
    }

    const toolDefinition = this.toolRegistry.get(toolCall.toolName);
    const policy =
      this.policyResolver.resolve(toolCall.toolName) ?? this.fallbackPolicy;

    const decision = policy.evaluate(execution, toolCall, toolDefinition);

    this.securityLogger.logDecision({
      execution,
      toolCall,
      capability: toolDefinition.capability,
      decision,
      extras: this.buildExtras(toolCall, decision),
    });

    return decision;
  }

  private buildExtras(
    toolCall: ToolCall,
    decision: ToolExecutionDecision,
  ): Record<string, string | number> | undefined {
    if (toolCall.toolName !== 'apply_credit') {
      return undefined;
    }

    const amount = Number(toolCall.arguments['amount']);
    const extras: Record<string, string | number> = {
      autonomousLimit: this.creditOptions.autonomousLimitUsd,
    };

    if (Number.isFinite(amount)) {
      extras['amount'] = amount;
    }

    if (decision.status === 'REQUIRE_APPROVAL') {
      extras['pendingTool'] = decision.pendingAction.tool;
    }

    return extras;
  }
}
