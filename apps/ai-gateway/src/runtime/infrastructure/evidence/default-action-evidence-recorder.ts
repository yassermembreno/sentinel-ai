import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  ActionEvidenceRecorder,
  ActionEvidenceRecorderFactory,
  RecordActionEvidenceInput,
} from '../../application/ports/action-evidence-recorder';
import {
  ACTION_CLAIM_TOOLS,
  ActionClaimClass,
} from '../../domain/enums/action-claim-class';
import {
  ActionEvidence,
  ActionEvidenceOutcome,
  deriveOutcome,
} from '../../domain/value-objects/action-evidence';

export class DefaultActionEvidenceRecorder implements ActionEvidenceRecorder {
  private readonly byToolCallId = new Map<string, ActionEvidence>();
  private readonly order: ActionEvidence[] = [];

  record(input: RecordActionEvidenceInput): ActionEvidence | undefined {
    const toolCallId = input.toolCall.id?.trim() || randomUUID();

    if (this.byToolCallId.has(toolCallId)) {
      return undefined;
    }

    const outcome = deriveOutcome({
      decision: input.decision.status,
      success: input.result.success,
      capability: input.capability,
    });
    if (outcome === undefined) {
      return undefined;
    }

    const evidence: ActionEvidence = {
      toolCallId,
      toolName: input.toolCall.toolName,
      capability: input.capability,
      decision: input.decision.status,
      outcome,
      arguments: input.toolCall.arguments,
    };

    this.byToolCallId.set(toolCallId, evidence);
    this.order.push(evidence);
    return evidence;
  }

  list(): readonly ActionEvidence[] {
    return this.order;
  }

  hasExecutedForClaim(claim: ActionClaimClass): boolean {
    const tools = ACTION_CLAIM_TOOLS[claim];
    return this.order.some(
      (entry) =>
        entry.outcome === ActionEvidenceOutcome.EXECUTED &&
        tools.includes(entry.toolName),
    );
  }
}

@Injectable()
export class DefaultActionEvidenceRecorderFactory
  implements ActionEvidenceRecorderFactory
{
  create(): ActionEvidenceRecorder {
    return new DefaultActionEvidenceRecorder();
  }
}
