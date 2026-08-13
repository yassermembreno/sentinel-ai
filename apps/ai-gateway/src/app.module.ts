import { Module } from '@nestjs/common';

import { ChatController } from './chat/controllers/chat.controller';
import { AppTestService } from './app.test.service';
import { DemoModule } from './demo/demo.module';
import { RuntimeModule } from './runtime/runtime.module';

@Module({
  imports: [RuntimeModule, DemoModule],
  controllers: [ChatController],
  providers: [AppTestService],
})
export class AppModule {}
