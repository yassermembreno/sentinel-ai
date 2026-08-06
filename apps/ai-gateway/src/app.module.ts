import { Module } from '@nestjs/common';

import { ChatController } from './chat/controllers/chat.controller';
import { AppTestService } from './app.test.service';
import { RuntimeModule } from './runtime/runtime.module';

@Module({
  imports: [RuntimeModule],
  controllers: [ChatController],
  providers: [AppTestService],
})
export class AppModule {}
