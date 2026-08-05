import { Execution } from "../../../runtime/domain/entities/execution";
import { LLMResponse } from "../../domain/value-objects/llm-response";

export interface LLMProvider {
    generate(
      execution: Execution,
    ): Promise<LLMResponse>;
  }