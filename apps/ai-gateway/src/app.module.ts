import { Module } from "@nestjs/common";

import { LlmModule } from "./llm/llm.module";
import { ToolsModule } from "./tools/tools.module";
import { AppTestService } from "./app.test.service";
import { RuntimeModule } from "./runtime/runtime.module";

@Module({
  imports: [
    LlmModule,
    ToolsModule,
    RuntimeModule,
  ],
  controllers: [],
  providers: [
    AppTestService,
  ],
})
export class AppModule {}