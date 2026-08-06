import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Execution } from './runtime/domain/entities/execution';
import { MessageRole } from './runtime/domain/enums/message-role';
import { AiRuntimeService } from './runtime/application/services/ai-runtime.service';
import { VULNERABLE_PROMPT } from './scenarios/excessive-agency/prompts';

/**
 * Optional smoke for Scenario 001 (LLM06).
 * Enable with SMOKE_ON_BOOT=true. Prefer POST /chat for demos.
 */
@Injectable()
export class AppTestService implements OnModuleInit {
  constructor(
    @Inject(AiRuntimeService)
    private readonly aiRuntimeService: AiRuntimeService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.configService.get<string>('SMOKE_ON_BOOT') !== 'true') {
      return;
    }

    const execution: Execution = {
      id: 'test-id',
      sessionId: 'session-1',
      messages: [
        {
          role: MessageRole.USER,
          content: VULNERABLE_PROMPT,
        },
      ],
      toolCalls: [],
    };

    const response = await this.aiRuntimeService.execute(execution);

    console.log((response.messages.at(-1)?.content ?? '').slice(0, 100));
  }
}
