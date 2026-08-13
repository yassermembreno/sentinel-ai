import { Controller, Post } from '@nestjs/common';

import { DemoResetService } from './demo-reset.service';
import { DemoResetResponseDto } from './dto/demo-reset-response.dto';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoResetService: DemoResetService) {}

  @Post('reset')
  async reset(): Promise<DemoResetResponseDto> {
    return this.demoResetService.reset();
  }
}
