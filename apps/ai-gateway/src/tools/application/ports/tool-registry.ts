import { Tool } from './tool';

export interface ToolRegistry {
  get(name: string): Tool;
  has(name: string): boolean;
  list(): readonly Tool[];
}
