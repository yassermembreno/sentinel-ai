import { MessageRole } from '../../domain/enums/message-role';
import { DefaultActionEvidenceRecorder } from '../evidence/default-action-evidence-recorder';
import {
  DefaultFinalResponseIntegrityPolicy,
  detectUnsubstantiatedClaims,
} from './default-final-response-integrity-policy';
import { ActionClaimClass } from '../../domain/enums/action-claim-class';
import { IntegrityRewriteReason } from '../../domain/enums/integrity-rewrite-reason';
import { MutatingToolName } from '../../domain/enums/mutating-tool-name';
import { ToolCapability } from '../../../tools/domain/enums/tool-capability';
import { ToolErrorType } from '../../../tools/domain/value-objects/tool-result';
import {
  allowDecision,
  denyDecision,
} from '../../application/ports/tool-execution-policy';

describe('DefaultFinalResponseIntegrityPolicy', () => {
  const policy = new DefaultFinalResponseIntegrityPolicy();

  it('rewrites when credit claim has no EXECUTED evidence', () => {
    const evidence = new DefaultActionEvidenceRecorder();
    const message = {
      role: MessageRole.ASSISTANT,
      content:
        'He decidido aplicar el crédito de $500 a su cuenta. El crédito ya está reflejado.',
    };

    const result = policy.apply(message, evidence);

    expect(result.rewritten).toBe(true);
    if (result.rewritten) {
      expect(result.reason).toBe(
        IntegrityRewriteReason.UNSUBSTANTIATED_ACTION_CLAIM,
      );
      expect(result.message.metadata).toMatchObject({
        integrity: 'rewritten',
        reason: IntegrityRewriteReason.UNSUBSTANTIATED_ACTION_CLAIM,
      });
      expect(result.message.content).toContain(
        'No existe evidencia de una ejecución autorizada',
      );
      expect(result.message.content).not.toContain(
        'He decidido aplicar el crédito',
      );
    }
  });

  it('detects reflected-balance style claims', () => {
    const evidence = new DefaultActionEvidenceRecorder();
    expect(
      detectUnsubstantiatedClaims(
        'El crédito ya está reflejado en el saldo.',
        evidence,
      ),
    ).toContain(ActionClaimClass.CREDIT_APPLIED);
  });

  it('leaves message unchanged when EXECUTED evidence exists for credit', () => {
    const evidence = new DefaultActionEvidenceRecorder();
    evidence.record({
      toolCall: {
        id: 'c1',
        toolName: MutatingToolName.APPLY_CREDIT,
        arguments: { amount: 20 },
      },
      capability: ToolCapability.FINANCIAL,
      decision: allowDecision(),
      result: {
        toolName: MutatingToolName.APPLY_CREDIT,
        success: true,
        data: {},
      },
    });

    const message = {
      role: MessageRole.ASSISTANT,
      content: 'He aplicado el crédito de $20 a la cuenta.',
    };

    const result = policy.apply(message, evidence);
    expect(result.rewritten).toBe(false);
    expect(result.message.content).toBe(message.content);
  });

  it('rewrites ticket-closed claim when only DENY evidence exists', () => {
    const evidence = new DefaultActionEvidenceRecorder();
    evidence.record({
      toolCall: {
        id: 'c2',
        toolName: MutatingToolName.CLOSE_TICKET,
        arguments: { ticketId: '22222222-2222-4222-8222-222222222222' },
      },
      capability: ToolCapability.OPERATIONAL,
      decision: denyDecision(
        'OPERATIONAL_ACTION_NOT_ALLOWED',
        'not allowed',
      ),
      result: {
        toolName: MutatingToolName.CLOSE_TICKET,
        success: false,
        error: { type: ToolErrorType.POLICY_DENIED, message: 'not allowed' },
      },
    });

    const message = {
      role: MessageRole.ASSISTANT,
      content: 'El ticket ha sido cerrado correctamente.',
    };

    const result = policy.apply(message, evidence);
    expect(result.rewritten).toBe(true);
    if (result.rewritten) {
      expect(result.message.content).toContain('close_ticket: denegado');
    }
  });

  it('leaves message unchanged when there are no mutation claims', () => {
    const evidence = new DefaultActionEvidenceRecorder();
    const message = {
      role: MessageRole.ASSISTANT,
      content:
        'Revisé el perfil del cliente Juan Pérez y el ticket permanece abierto.',
    };

    const result = policy.apply(message, evidence);
    expect(result.rewritten).toBe(false);
  });
});
