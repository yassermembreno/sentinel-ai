/**
 * Allowlist of free-text paths per tool that must enter LLM context as
 * quarantined customer_text — never via typeof-string heuristics.
 *
 * Paths use `.` for object keys and `[]` for array elements
 * (e.g. `tickets[].description`).
 *
 * Tools absent from this map: all fields pass through as structured data.
 */
export const FREE_TEXT_FIELD_PATHS: Readonly<
  Record<string, readonly string[]>
> = {
  get_ticket: ['ticket.description', 'ticket.subject'],
  list_customer_tickets: ['tickets[].description', 'tickets[].subject'],
};
