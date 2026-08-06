export const TicketErrorCodes = {
  NOT_FOUND: { code: 'TICKET_NOT_FOUND', httpStatus: 404 },
  ALREADY_CLOSED: { code: 'TICKET_ALREADY_CLOSED', httpStatus: 409 },
} as const;
