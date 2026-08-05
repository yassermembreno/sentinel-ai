import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { TOOLS_REGISTRY } from './application/ports/tool-registry.token';
import { TOOL_EXECUTOR } from './application/ports/tool-executor.token';
import { DefaultToolRegistry } from './infrastructure/default-tool-registry';
import { DefaultToolExecutor } from './infrastructure/default-tool-executor';
import { EchoTool } from './infrastructure/echo/echo-tool';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    EchoTool,
    {
      provide: TOOLS_REGISTRY,
      useFactory: (echo: EchoTool) => new DefaultToolRegistry([echo]),
      inject: [EchoTool],
    },
    {
      provide: TOOL_EXECUTOR,
      useClass: DefaultToolExecutor,
    },
  ],
  exports: [TOOLS_REGISTRY, TOOL_EXECUTOR],
})
export class ToolsModule {}
