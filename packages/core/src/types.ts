import { z } from "zod";

export interface RequinToolDefinition<
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> {
  name: string;
  description: string;
  parameters: TSchema;
  execute: (args: z.infer<TSchema>) => Promise<unknown> | unknown;
}

export interface RegisterToolsOptions {
  tools: RequinToolDefinition<any>[];
}

export interface RequinMcpServerInstance {
  /**
   * Register tool list with MCP server
   */
  tools(options: RegisterToolsOptions): RequinMcpServerInstance;

  /**
   * Start WebSocket/SSE connection to Requin Cloud
   */
  connect(): Promise<void>;

  /**
   * Close the connect with server
   */
  close(): Promise<void>;
}
