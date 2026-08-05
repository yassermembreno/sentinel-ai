import { ChatPipeline } from "./chat-pipeline";

export interface PipelineResolver {
    resolve(): Promise<ChatPipeline>;
}