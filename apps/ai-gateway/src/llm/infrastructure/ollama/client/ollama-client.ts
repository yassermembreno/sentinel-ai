import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";

import { OllamaChatResponse } from "../dtos/ollama-chat-response";
import { OLLAMA_OPTIONS } from "../options/ollama.options.token";
import { OllamaOptions } from "../options/ollama.options";
import { OllamaChatPayload } from "../dtos/ollama-chat-payload";

@Injectable()
export class OllamaClient {
  constructor(    
    @Inject(OLLAMA_OPTIONS)
    private readonly options: OllamaOptions,
  ) {}

  async chat(
    payload: OllamaChatPayload,
  ): Promise<OllamaChatResponse> {   

    const { data } = await axios.post<OllamaChatResponse>(
      `${this.options.baseUrl}/api/chat`,
      { ...payload, model: this.options.model },
    );

    return data;
  }
}
