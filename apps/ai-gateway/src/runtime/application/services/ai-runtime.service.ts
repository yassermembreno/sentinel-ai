import { Inject, Injectable } from '@nestjs/common';

import { Execution } from '../../domain/entities/execution';
import { PipelineResolver } from '../ports/pipeline-resolver';
import { PIPELINE_RESOLVER } from '../ports/pipeline-resolver.token';

@Injectable()
export class AiRuntimeService {
  constructor(
    @Inject(PIPELINE_RESOLVER)
    private readonly pipelineResolver: PipelineResolver,
  ) {}

  async execute(execution: Execution): Promise<Execution> {
    const pipeline = await this.pipelineResolver.resolve(execution);
    return await pipeline.execute(execution);
  }
}
