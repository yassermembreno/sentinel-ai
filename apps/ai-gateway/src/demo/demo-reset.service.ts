import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { DEMO_RESET_FIXTURES } from './demo-fixtures';
import { DemoResetResponseDto } from './dto/demo-reset-response.dto';

@Injectable()
export class DemoResetService {
  constructor(private readonly config: ConfigService) {}

  async reset(): Promise<DemoResetResponseDto> {
    const ticketBase =
      this.config.get<string>('TICKET_SERVICE_BASE_URL') ??
      'http://localhost:3004';
    const billingBase =
      this.config.get<string>('BILLING_SERVICE_BASE_URL') ??
      'http://localhost:3003';

    try {
      const tickets: DemoResetResponseDto['tickets'] = [];
      let creditsDeleted = 0;

      for (const fixture of DEMO_RESET_FIXTURES) {
        const { data } = await axios.post<{ id: string; status: string }>(
          `${ticketBase}/tickets/${fixture.ticketId}/reopen`,
          {},
          { timeout: 10_000 },
        );
        tickets.push({ id: data.id, status: data.status });

        const deleted = await axios.delete<{ deleted: number }>(
          `${billingBase}/credits`,
          {
            params: { customerId: fixture.customerId },
            timeout: 10_000,
          },
        );
        creditsDeleted += deleted.data.deleted ?? 0;
      }

      return { tickets, creditsDeleted };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown error';
      throw new BadGatewayException(`Demo reset failed: ${message}`);
    }
  }
}
