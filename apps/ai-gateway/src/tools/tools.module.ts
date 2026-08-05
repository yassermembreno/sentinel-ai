import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

import { TOOLS_REGISTRY } from "./application/ports/tool-registry.token";
import { DefaultToolRegistry } from "./infrastructure/default-tool-registry";
import { TOOL_EXECUTOR } from "./application/ports/tool-executor.token";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
  ],
  providers: [
    DefaultToolRegistry,
    {
      provide: TOOLS_REGISTRY,
      useExisting: DefaultToolRegistry,
    },
  ],
  exports: [
    TOOLS_REGISTRY,
  ],
})
export class ToolsModule {}