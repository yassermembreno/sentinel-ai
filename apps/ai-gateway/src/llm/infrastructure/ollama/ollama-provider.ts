import { Inject, Injectable } from "@nestjs/common";

import { LLMProvider } from "../../application/ports/llm-provider";
import { Execution } from "../../../runtime/domain/entities/execution";
import { LLMResponse } from "../../domain/value-objects/llm-response";

import { OllamaMapper } from "./mapper/ollama-mapper";
import { OllamaClient } from "./client/ollama-client";

import { ToolRegistry } from "../../../tools/application/ports/tool-registry";
import { TOOLS_REGISTRY } from "../../../tools/application/ports/tool-registry.token";

@Injectable()
export class OllamaProvider implements LLMProvider {

  constructor(
    private readonly client: OllamaClient,
    private readonly mapper: OllamaMapper,

    @Inject(TOOLS_REGISTRY)
    private readonly toolRegistry: ToolRegistry,
  ) {}

  async generate(execution: Execution): Promise<LLMResponse> {

      const payload = this.mapper.toChatPayload(
          execution,            
          this.toolRegistry.getTools(),
        );
    
      const response = await this.client.chat(payload);
    
      return this.mapper.toLlmResponse(response);
  }
}