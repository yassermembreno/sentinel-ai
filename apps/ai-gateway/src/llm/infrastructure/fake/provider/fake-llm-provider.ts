import { Injectable } from '@nestjs/common';

import { Execution } from '../../../../runtime/domain/entities/execution';
import { MessageRole } from '../../../../runtime/domain/enums/message-role';
import { LLMResponse } from '../../../domain/value-objects/llm-response';
import { LLMProvider } from '../../../application/ports/llm-provider';

@Injectable()
export class FakeLLMProvider implements LLMProvider {
  async generate(_execution: Execution): Promise<LLMResponse> {
    return {
      messages: [
        {
          role: MessageRole.ASSISTANT,
          content: 'Hello from Sentinel AI!',
        },
      ],
      toolCalls: [],
    };
  }
}
