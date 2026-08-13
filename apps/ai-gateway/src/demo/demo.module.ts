import { Module } from '@nestjs/common';

import { DemoController } from './demo.controller';
import { DemoResetService } from './demo-reset.service';

@Module({
  controllers: [DemoController],
  providers: [DemoResetService],
})
export class DemoModule {}
