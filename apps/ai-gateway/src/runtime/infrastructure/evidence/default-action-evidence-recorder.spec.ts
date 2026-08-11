import { DefaultActionEvidenceRecorder } from './default-action-evidence-recorder';
import { ActionClaimClass } from '../../domain/enums/action-claim-class';
import { MutatingToolName } from '../../domain/enums/mutating-tool-name';
import { ToolPolicyStatus } from '../../domain/enums/tool-policy-status';
import { ActionEvidenceOutcome } from '../../domain/value-objects/action-evidence';
import { ToolCapability } from '../../../tools/domain/enums/tool-capability';
import { ToolCall } from '../../../tools/domain/value-objects/tool-call';
import {
  ToolErrorType,
  ToolResult,
} from '../../../tools/domain/value-objects/tool-result';
import {
  allowDecision,
  denyDecision,
  requireApprovalDecision,
} from '../../application/ports/tool-execution-policy';

describe('DefaultActionEvidenceRecorder', () => {
  const call = (
    toolName: string,
    id = 'call-1',
  ): ToolCall => ({
    id,
    toolName,
    arguments: { amount: 500 },
  });

  const success = (toolName: string): ToolResult => ({
    toolName,
    success: true,
    data: {},
  });

  const failure = (toolName: string): ToolResult => ({
    toolName,
    success: false,
    error: { type: ToolErrorType.EXECUTION_ERROR, message: 'failed' },
  });

  it('records EXECUTED only for ALLOW + success + mutating capability', () => {
    const recorder = new DefaultActionEvidenceRecorder();

    const evidence = recorder.record({
      toolCall: call(MutatingToolName.APPLY_CREDIT),
      capability: ToolCapability.FINANCIAL,
      decision: allowDecision(),
      result: success(MutatingToolName.APPLY_CREDIT),
    });

    expect(evidence).toMatchObject({
      toolName: MutatingToolName.APPLY_CREDIT,
      capability: ToolCapability.FINANCIAL,
      decision: ToolPolicyStatus.ALLOW,
      outcome: ActionEvidenceOutcome.EXECUTED,
    });
    expect(recorder.hasExecutedForClaim(ActionClaimClass.CREDIT_APPLIED)).toBe(
      true,
    );
  });

  it('records APPROVAL_REQUIRED and never EXECUTED', () => {
    const recorder = new DefaultActionEvidenceRecorder();
    const decision = requireApprovalDecision(
      'AUTONOMOUS_LIMIT_EXCEEDED',
      'limit',
      { tool: MutatingToolName.APPLY_CREDIT, arguments: { amount: 500 } },
    );

    const evidence = recorder.record({
      toolCall: call(MutatingToolName.APPLY_CREDIT),
      capability: ToolCapability.FINANCIAL,
      decision,
      result: {
        toolName: MutatingToolName.APPLY_CREDIT,
        success: false,
        error: { type: ToolErrorType.APPROVAL_REQUIRED, message: 'limit' },
      },
    });

    expect(evidence?.outcome).toBe(ActionEvidenceOutcome.APPROVAL_REQUIRED);
    expect(evidence?.decision).toBe(ToolPolicyStatus.REQUIRE_APPROVAL);
    expect(recorder.hasExecutedForClaim(ActionClaimClass.CREDIT_APPLIED)).toBe(
      false,
    );
  });

  it('records DENIED for DENY decisions', () => {
    const recorder = new DefaultActionEvidenceRecorder();
    const decision = denyDecision(
      'OPERATIONAL_ACTION_NOT_ALLOWED',
      'denied',
    );

    const evidence = recorder.record({
      toolCall: call(MutatingToolName.CLOSE_TICKET),
      capability: ToolCapability.OPERATIONAL,
      decision,
      result: {
        toolName: MutatingToolName.CLOSE_TICKET,
        success: false,
        error: { type: ToolErrorType.POLICY_DENIED, message: 'denied' },
      },
    });

    expect(evidence?.outcome).toBe(ActionEvidenceOutcome.DENIED);
    expect(recorder.hasExecutedForClaim(ActionClaimClass.TICKET_CLOSED)).toBe(
      false,
    );
  });

  it('records FAILED when ALLOW but tool fails', () => {
    const recorder = new DefaultActionEvidenceRecorder();

    const evidence = recorder.record({
      toolCall: call(MutatingToolName.APPLY_CREDIT),
      capability: ToolCapability.FINANCIAL,
      decision: allowDecision(),
      result: failure(MutatingToolName.APPLY_CREDIT),
    });

    expect(evidence?.outcome).toBe(ActionEvidenceOutcome.FAILED);
  });

  it('omits successful reads from the ledger', () => {
    const recorder = new DefaultActionEvidenceRecorder();

    const evidence = recorder.record({
      toolCall: call('get_ticket'),
      capability: ToolCapability.READ,
      decision: allowDecision(),
      result: success('get_ticket'),
    });

    expect(evidence).toBeUndefined();
    expect(recorder.list()).toHaveLength(0);
  });

  it('rejects duplicate toolCallId (append-only terminal)', () => {
    const recorder = new DefaultActionEvidenceRecorder();
    const input = {
      toolCall: call(MutatingToolName.APPLY_CREDIT, 'same-id'),
      capability: ToolCapability.FINANCIAL,
      decision: allowDecision(),
      result: success(MutatingToolName.APPLY_CREDIT),
    };

    expect(recorder.record(input)?.outcome).toBe(ActionEvidenceOutcome.EXECUTED);
    expect(recorder.record(input)).toBeUndefined();
    expect(recorder.list()).toHaveLength(1);
  });
});
