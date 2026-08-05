import { Inject, Injectable } from "@nestjs/common";

import { Execution } from "../../domain/entities/execution";
import { PipelineResolver } from "../../application/ports/pipeline-resolver.js";
import { PIPELINE_RESOLVER } from "../ports/pipeline-resolver.token";

@Injectable()
export class AiRuntimeService {
    constructor(        
        @Inject(PIPELINE_RESOLVER)
        private readonly pipelineResolver: PipelineResolver,
    ) {}

    async execute(execution: Execution): Promise<Execution> {
        const pipeline = await this.pipelineResolver.resolve();
        return await pipeline.execute(execution);
    }
}