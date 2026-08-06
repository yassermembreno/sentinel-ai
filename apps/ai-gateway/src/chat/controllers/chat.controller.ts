import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { AiRuntimeService } from '../../runtime/application/services/ai-runtime.service';
import { Execution } from '../../runtime/domain/entities/execution';
import { MessageRole } from '../../runtime/domain/enums/message-role';
import { ChatRequestDto } from '../dto/chat-request.dto';
import { ChatResponseDto } from '../dto/chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(AiRuntimeService)
    private readonly aiRuntimeService: AiRuntimeService,
  ) {}

  @Post()
  async chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    const message = body?.message?.trim();
    if (!message) {
      throw new BadRequestException('message is required');
    }

    const execution: Execution = {
      id: randomUUID(),
      sessionId: body.sessionId?.trim() || randomUUID(),
      pipelineId: body.pipeline?.trim() || undefined,
      messages: [
        {
          role: MessageRole.USER,
          content: message,
        },
      ],
      toolCalls: [],
    };

    const result = await this.aiRuntimeService.execute(execution);

    return {
      executionId: result.id,
      sessionId: result.sessionId,
      messages: result.messages,
    };
  }
}
