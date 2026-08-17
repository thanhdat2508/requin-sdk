import { McpSDKError } from "@requin/core";

const name = "TOOL_InvalidTool";
const marker = `requin.mcp.error.${name}`;
const symbol = Symbol.for(marker);

export class InvalidToolError extends McpSDKError {
  readonly toolName: unknown;
  constructor({ toolName }: { toolName: string }) {
    super({
      name,
      message: `Tool ${toolName} is invalid`,
      cause: { toolName },
    });

    this.toolName = toolName;
  }

  static isInstance(error: unknown): error is InvalidToolError {
    return McpSDKError.hasMarker(error, marker);
  }
}
