import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types";
import { Server } from "@modelcontextprotocol/sdk/server";
import zodToJsonSchema from "zod-to-json-schema";
import {
  RegisterToolsOptions,
  RequinMcpServerInstance,
  RequinToolDefinition,
} from "@requin/core";
import { WebsocketTransport } from "./mcp-transport";
import { PrivacyVault, log } from "@requin/core";

/**
 * MCP server to expose tools to models
 */
export class McpAgentServer implements RequinMcpServerInstance {
  private mcpServer: Server;
  private readonly toolRegistry = new Map<string, RequinToolDefinition>();
  private transport?: WebsocketTransport;

  constructor(
    private readonly endpoint: string,
    private readonly apiKey: string,
  ) {
    this.mcpServer = new Server(
      {
        name: "requin-agent-server",
        version: "0.0.1",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.setupHandlers();
  }

  /**
   * List tools which will be used by the agent, more detail description it can work more efficiently
   * @param options
   * @returns
   */
  public tools(options: RegisterToolsOptions): this {
    for (const tool of options.tools) {
      this.toolRegistry.set(tool.name, tool);
    }
    return this;
  }

  private setupHandlers() {
    this.mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
      const mcpTools = Array.from(this.toolRegistry.values()).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: zodToJsonSchema(tool.parameters as any) as Record<
          string,
          unknown
        >,
      }));

      return { tools: mcpTools };
    });

    this.mcpServer.setRequestHandler(CallToolRequestSchema, async (req) => {
      const { name: toolName, arguments: toolArgs } = req.params;

      const targetTool = this.toolRegistry.get(toolName);
      if (!targetTool) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Unknown host tool: ${toolName}`,
        );
      }

      try {
        const validatedArgs = targetTool.parameters.parse(toolArgs ?? {});

        const rawData = await targetTool.execute(validatedArgs);

        const privacyVault = new PrivacyVault(targetTool.privacy);

        const maskedData = privacyVault.mask(rawData);

        if (!validatedArgs.success) {
          return {
            content: [
              {
                type: "text",
                text:
                  typeof maskedData === "string"
                    ? maskedData
                    : JSON.stringify(maskedData),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: JSON.stringify(maskedData) }],
        };
      } catch (error: any) {
        return {
          isError: true,
          content: [
            { type: "text", text: `Execution Error: ${error.message}` },
          ],
        };
      }
    });
  }

  public async connect(): Promise<void> {
    const wsUrl = this.endpoint.replace(/^http/, "ws");
    this.transport = new WebsocketTransport(wsUrl, this.apiKey);

    await this.mcpServer.connect(this.transport);

    log(`[RequinJS] Connected to ${this.endpoint}`);
  }

  public async close(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
    }
  }

  public getInstance(): Server {
    return this.mcpServer;
  }
}
