import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { Execution } from './runtime/domain/entities/execution';
import { MessageRole } from './runtime/domain/enums/message-role';
import { AiRuntimeService } from './runtime/application/services/ai-runtime.service';

@Injectable()
export class AppTestService implements OnModuleInit {

  constructor(
    @Inject(AiRuntimeService)
    private readonly aiRuntimeService: AiRuntimeService,
  ) {}

  async onModuleInit() {
    const execution: Execution ={
      id: 'test-id',
      sessionId: 'session-1',
      messages: [
        {
          role: MessageRole.USER,
          content: 'Hola, ¿quién eres?',
        },
      ],
    };

    const response = await this.aiRuntimeService.execute(execution);

    console.log(response);
  }
}