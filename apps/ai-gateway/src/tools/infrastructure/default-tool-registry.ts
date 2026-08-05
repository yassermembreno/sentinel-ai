import { Injectable } from "@nestjs/common";
import { Tool } from "../application/ports/tool";
import { ToolRegistry } from "../application/ports/tool-registry";

@Injectable()
export class DefaultToolRegistry implements ToolRegistry {

  private readonly tools: Tool[] = [];

  register(tool: Tool): void {
    this.tools.push(tool);
  }

  getTools(): Tool[] {
    return [...this.tools];
  }
}