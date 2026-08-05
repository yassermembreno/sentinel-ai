import { Tool } from "./tool";

export interface ToolRegistry {
    register(tool: Tool): void;
    getTools(): Tool[];
}