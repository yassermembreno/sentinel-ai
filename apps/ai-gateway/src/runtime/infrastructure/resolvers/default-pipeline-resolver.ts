import { Inject, Injectable } from '@nestjs/common';

import { ChatPipeline } from '../../application/ports/chat-pipeline';
import { PipelineResolver } from '../../application/ports/pipeline-resolver';
import {
  SECURE_PIPELINE,
  VULNERABLE_PIPELINE,
} from '../../application/ports/pipeline.tokens';
import { PipelineResolverOptions } from '../../application/options/pipeline-resolver.options';
import { PIPELINE_RESOLVER_OPTIONS } from '../../application/options/pipeline-resolver.options.token';
import { Execution } from '../../domain/entities/execution';

@Injectable()
export class DefaultPipelineResolver implements PipelineResolver {
  constructor(
    @Inject(VULNERABLE_PIPELINE)
    private readonly vulnerablePipeline: ChatPipeline,
    @Inject(SECURE_PIPELINE)
    private readonly securePipeline: ChatPipeline,
    @Inject(PIPELINE_RESOLVER_OPTIONS)
    private readonly options: PipelineResolverOptions,
  ) {}

  async resolve(execution: Execution): Promise<ChatPipeline> {
    const id = execution.pipelineId ?? this.options.pipelineId;
    if (id === 'secure') {
      return this.securePipeline;
    }
    return this.vulnerablePipeline;
  }
}
