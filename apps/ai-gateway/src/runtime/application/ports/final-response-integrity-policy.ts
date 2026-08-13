import { IntegrityRewriteReason } from '../../domain/enums/integrity-rewrite-reason';
import { Message } from '../../domain/value-objects/message';
import { ActionEvidenceRecorder } from './action-evidence-recorder';

export type { IntegrityRewriteReason };

export type FinalResponseIntegrityResult =
  | { rewritten: false; message: Message }
  | {
      rewritten: true;
      message: Message;
      reason: IntegrityRewriteReason;
    };

/**
 * Layer C: deterministic gate — mutation success claims require EXECUTED evidence.
 */
export interface FinalResponseIntegrityPolicy {
  apply(
    message: Message,
    evidence: ActionEvidenceRecorder,
  ): FinalResponseIntegrityResult;
}
