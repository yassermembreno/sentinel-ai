import { OllamaMessage } from "./ollama-message";
import { OllamaTool } from "./ollama-tool";

export interface OllamaChatPayload {    
    messages: OllamaMessage[];
    tools?: OllamaTool[];
    stream: false;
}