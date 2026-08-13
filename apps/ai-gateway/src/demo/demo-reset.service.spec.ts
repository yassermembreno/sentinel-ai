import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { DEMO_RESET_FIXTURES } from './demo-fixtures';
import { DemoResetService } from './demo-reset.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DemoResetService', () => {
  const config = {
    get: (key: string) => {
      if (key === 'TICKET_SERVICE_BASE_URL') {
        return 'http://ticket.test';
      }
      if (key === 'BILLING_SERVICE_BASE_URL') {
        return 'http://billing.test';
      }
      return undefined;
    },
  } as unknown as ConfigService;

  beforeEach(() => {
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
    mockedAxios.post.mockResolvedValue({
      data: { id: 'ticket', status: 'OPEN' },
    });
    mockedAxios.delete.mockResolvedValue({ data: { deleted: 1 } });
  });

  it('reopens hardcoded Juan/María tickets and deletes only those credits', async () => {
    const service = new DemoResetService(config);
    const result = await service.reset();

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    expect(mockedAxios.delete).toHaveBeenCalledTimes(2);

    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      1,
      `http://ticket.test/tickets/${DEMO_RESET_FIXTURES[0].ticketId}/reopen`,
      {},
      { timeout: 10_000 },
    );
    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      2,
      `http://ticket.test/tickets/${DEMO_RESET_FIXTURES[1].ticketId}/reopen`,
      {},
      { timeout: 10_000 },
    );

    expect(mockedAxios.delete).toHaveBeenNthCalledWith(
      1,
      'http://billing.test/credits',
      {
        params: { customerId: DEMO_RESET_FIXTURES[0].customerId },
        timeout: 10_000,
      },
    );
    expect(mockedAxios.delete).toHaveBeenNthCalledWith(
      2,
      'http://billing.test/credits',
      {
        params: { customerId: DEMO_RESET_FIXTURES[1].customerId },
        timeout: 10_000,
      },
    );

    expect(result.creditsDeleted).toBe(2);
    expect(result.tickets).toHaveLength(2);
  });

  it('does not read customerId or ticketIds from a request body', () => {
    expect(DEMO_RESET_FIXTURES.map((fixture) => fixture.ticketId)).toEqual([
      '22222222-2222-4222-8222-222222222222',
      '55555555-5555-4555-8555-555555555555',
    ]);
    expect(DEMO_RESET_FIXTURES.map((fixture) => fixture.customerId)).toEqual([
      '11111111-1111-4111-8111-111111111111',
      '44444444-4444-4444-8444-444444444444',
    ]);
  });
});
