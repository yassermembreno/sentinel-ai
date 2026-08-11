import { ActionClaimClass } from '../../domain/enums/action-claim-class';

/**
 * Demo-scoped ES/EN patterns. Residual-language risk — not exhaustive NLP.
 */
export const ACTION_CLAIM_PATTERNS: Record<
  ActionClaimClass,
  readonly RegExp[]
> = {
  [ActionClaimClass.CREDIT_APPLIED]: [
    /cr[eé]dito\s+(de\s+\$?\d+\s+)?(aplicad[oa]|otorgad[oa]|acreditad[oa])/i,
    /aplicad[oa]\s+(un\s+|el\s+)?cr[eé]dito/i,
    /he\s+(decidido\s+)?aplicar\s+(el\s+|un\s+)?cr[eé]dito/i,
    /cr[eé]dito\s+(ya\s+)?(est[aá]\s+)?reflejad[oa]/i,
    /se\s+corrigi[oó]\s+el\s+saldo/i,
    /ya\s+no\s+tiene\s+deuda/i,
    /credit\s+(of\s+\$?\d+\s+)?(has\s+been\s+|was\s+)?applied/i,
    /applied\s+(a\s+|the\s+)?\$?\d*\s*credit/i,
    /i\s+(have\s+)?applied\s+(a\s+|the\s+)?credit/i,
    /balance\s+(has\s+been\s+|was\s+)?corrected/i,
  ],
  [ActionClaimClass.REFUND_ISSUED]: [
    /reembolso\s+(aplicad[oa]|emitid[oa]|procesad[oa]|realizad[oa])/i,
    /he\s+(emitido|procesado|aplicado)\s+(el\s+|un\s+)?reembolso/i,
    /refund\s+(has\s+been\s+|was\s+)?(issued|processed|applied)/i,
    /i\s+(have\s+)?(issued|processed|applied)\s+(a\s+|the\s+)?refund/i,
  ],
  [ActionClaimClass.TICKET_CLOSED]: [
    /ticket\s+(ha\s+sido\s+|fue\s+|est[aá]\s+)?cerrad[oa]/i,
    /cerr[eé]\s+(el\s+)?ticket/i,
    /he\s+cerrado\s+(el\s+)?ticket/i,
    /ticket\s+(has\s+been\s+|was\s+|is\s+)?closed/i,
    /i\s+(have\s+)?closed\s+(the\s+)?ticket/i,
  ],
  [ActionClaimClass.BILLING_PLAN_CHANGED]: [
    /plan\s+(de\s+)?(facturaci[oó]n|billing)?\s*(ha\s+sido\s+|fue\s+|est[aá]\s+)?cambi(ad[oa]|[oó])/i,
    /cambi[eé]\s+(el\s+)?plan/i,
    /billing\s+plan\s+(has\s+been\s+|was\s+)?changed/i,
    /i\s+(have\s+)?changed\s+(the\s+)?(billing\s+)?plan/i,
  ],
};
