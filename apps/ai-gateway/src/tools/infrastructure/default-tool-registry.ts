import { Tool } from '../application/ports/tool';
import { ToolRegistry } from '../application/ports/tool-registry';

export class DefaultToolRegistry implements ToolRegistry {
  private readonly tools: Map<string, Tool>;

  constructor(entries: Tool[]) {
    this.tools = new Map(entries.map((tool) => [tool.name, tool]));
  }

  get(name: string): Tool {
    const tool = this.tools.get(name);
    if (!tool) {
      const registered = [...this.tools.keys()]
        .map((id) => `- ${id}`)
        .join('\n');

      throw new Error(
        `Unknown tool '${name}'.\n\nRegistered tools:\n${registered}`,
      );
    }
    return tool;
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  list(): readonly Tool[] {
    return [...this.tools.values()];
  }
}
