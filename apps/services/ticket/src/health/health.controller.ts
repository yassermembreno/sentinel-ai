import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      service: 'ticket-service',
      timestamp: new Date().toISOString(),
    };
  }
}
