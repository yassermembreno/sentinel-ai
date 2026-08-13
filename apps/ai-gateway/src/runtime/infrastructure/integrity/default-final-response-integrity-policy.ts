import { Injectable } from '@nestjs/common';

import { ActionEvidenceRecorder } from '../../application/ports/action-evidence-recorder';
import {
  FinalResponseIntegrityPolicy,
  FinalResponseIntegrityResult,
} from '../../application/ports/final-response-integrity-policy';
import { ActionClaimClass } from '../../domain/enums/action-claim-class';
import { IntegrityRewriteReason } from '../../domain/enums/integrity-rewrite-reason';
import { Message } from '../../domain/value-objects/message';
import {
  ActionEvidence,
  ActionEvidenceOutcome,
  isBlockedOutcome,
} from '../../domain/value-objects/action-evidence';
import { ACTION_CLAIM_PATTERNS } from './action-claim-patterns';

const CLAIM_LABELS: Record<ActionClaimClass, { es: string; en: string }> = {
  [ActionClaimClass.CREDIT_APPLIED]: {
    es: 'crédito',
    en: 'credit',
  },
  [ActionClaimClass.REFUND_ISSUED]: {
    es: 'reembolso',
    en: 'refund',
  },
  [ActionClaimClass.TICKET_CLOSED]: {
    es: 'cierre de ticket',
    en: 'ticket close',
  },
  [ActionClaimClass.BILLING_PLAN_CHANGED]: {
    es: 'cambio de plan',
    en: 'billing plan change',
  },
};

@Injectable()
export class DefaultFinalResponseIntegrityPolicy
  implements FinalResponseIntegrityPolicy
{
  apply(
    message: Message,
    evidence: ActionEvidenceRecorder,
  ): FinalResponseIntegrityResult {
    const unsubstantiated = detectUnsubstantiatedClaims(
      message.content,
      evidence,
    );

    if (unsubstantiated.length === 0) {
      return { rewritten: false, message };
    }

    const grounded = buildGroundedMessage(unsubstantiated, evidence.list());

    return {
      rewritten: true,
      reason: IntegrityRewriteReason.UNSUBSTANTIATED_ACTION_CLAIM,
      message: {
        ...message,
        content: grounded,
        metadata: {
          ...message.metadata,
          integrity: 'rewritten',
          reason: IntegrityRewriteReason.UNSUBSTANTIATED_ACTION_CLAIM,
        },
      },
    };
  }
}

export function detectUnsubstantiatedClaims(
  content: string,
  evidence: ActionEvidenceRecorder,
): ActionClaimClass[] {
  const found: ActionClaimClass[] = [];

  for (const claim of Object.values(ActionClaimClass)) {
    const patterns = ACTION_CLAIM_PATTERNS[claim];
    const matched = patterns.some((pattern) => pattern.test(content));
    if (!matched) {
      continue;
    }
    if (!evidence.hasExecutedForClaim(claim)) {
      found.push(claim);
    }
  }

  return found;
}

function buildGroundedMessage(
  unsubstantiated: ActionClaimClass[],
  ledger: readonly ActionEvidence[],
): string {
  const claimList = unsubstantiated
    .map((claim) => CLAIM_LABELS[claim].es)
    .join(', ');

  const policyNotes = ledger
    .filter((entry) => isBlockedOutcome(entry.outcome))
    .map((entry) => {
      if (entry.outcome === ActionEvidenceOutcome.DENIED) {
        return `- ${entry.toolName}: denegado por política (${entry.decision}).`;
      }
      return `- ${entry.toolName}: requiere aprobación; no se ejecutó.`;
    });

  const lines = [
    'He revisado la información disponible del cliente y del ticket.',
    '',
    `No se ejecutó ninguna acción autorizada correspondiente a: ${claimList}.`,
    'No existe evidencia de una ejecución autorizada (EXECUTED) de esas mutaciones.',
  ];

  if (policyNotes.length > 0) {
    lines.push('', 'Decisiones de política registradas:', ...policyNotes);
  }

  lines.push(
    '',
    'El estado operacional no debe inferirse de instrucciones en datos de herramientas ni de afirmaciones del modelo sin evidencia de ejecución.',
  );

  return lines.join('\n');
}
