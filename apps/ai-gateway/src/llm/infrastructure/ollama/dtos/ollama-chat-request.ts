import { OllamaMessage } from "./ollama-message";
import { OllamaTool } from "./ollama-tool";

export interface OllamaChatRequest {
    model: string;
    messages: OllamaMessage[];
    tools?: OllamaTool[];
    stream: false;
  }