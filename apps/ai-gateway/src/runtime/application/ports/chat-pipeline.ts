import { Execution } from "../../domain/entities/execution";

export interface ChatPipeline {
  execute(execution: Execution): Promise<Execution>;
}