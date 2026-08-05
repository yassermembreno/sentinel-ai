export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly parameters: Record<string, unknown>;
    
  execute(args: Record<string, unknown>): Promise<Record<string, unknown>>;
}