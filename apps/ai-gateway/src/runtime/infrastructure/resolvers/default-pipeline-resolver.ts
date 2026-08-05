import { Inject, Injectable } from "@nestjs/common";
import { ChatPipeline } from "../../application/ports/chat-pipeline";
import { PipelineResolver } from "../../application/ports/pipeline-resolver";
import { CHAT_PIPELINE } from "../../application/ports/chat-pipeline.token";

@Injectable()
export class DefaultPipelineResolver implements PipelineResolver {

  constructor(
    @Inject(CHAT_PIPELINE)
    private readonly pipeline: ChatPipeline,
  ) {}

  async resolve(): Promise<ChatPipeline> {
    return this.pipeline;
  }
}