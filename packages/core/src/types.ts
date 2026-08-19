import { z } from "zod";
import { PatternConfig } from "./vault/private";

export interface RequinToolDefinition<
  TSchema extends z.ZodTypeAny = z.ZodTypeAny,
  TOutput extends z.ZodTypeAny = z.ZodTypeAny,
> {
  name: string;
  description: string;
  parameters: TSchema;
  outputSchema?: TOutput;
  privacy?: PatternConfig;
  execute: (
    args: z.infer<TSchema>,
  ) => Promise<z.infer<TOutput>> | z.infer<TOutput>;
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
