import { RegisterToolsOptions, RequinMcpServerInstance } from "@requin/core";
import { checkApiKeyFormat, validateCloudUrl } from "./lib/helper";
import { McpAgentServer } from "@requin/mcp";

export default class createMcpConnect implements RequinMcpServerInstance {
  private mcpServer: McpAgentServer;

  /**
   *
   * Create a new SDK Connection for your project
   *
   * @param requinUrl - Requin Cloud URL which is supplied when you create a new project in your project dashboard
   * @param requinApiKey - Requin API Key which is supplied when you create a new project in your project dashboard
   * @param tools - Tools to be used by the agent (More details you describe, more efficient AI Agent work for you)
   */
  constructor(
    protected requinUrl: string,
    protected requinApiKey: string,
  ) {
    const baseUrl = validateCloudUrl(requinUrl);

    if (!requinApiKey) throw new Error("Requin API Key is required.");

    checkApiKeyFormat(requinApiKey);

    this.mcpServer = new McpAgentServer(baseUrl.toString(), requinApiKey);
  }

  /**
   * Start a connect to Requin cloud server
   */
  public async connect(): Promise<void> {
    await this.mcpServer.connect();

    console.log("Successfully connected to Cloud AI!");
  }

  public tools(tools: RegisterToolsOptions): this {
    this.mcpServer.tools(tools);
    return this;
  }

  public async close(): Promise<void> {
    await this.mcpServer.close();
  }
}

/**
 * Requin SDK
 *
 * A SDK use to connect your project to Requin agent
 * @param requinUrl - Requin Cloud URL
 * @param requinApiKey - Requin API Key
 * @param tools - Tools to be used by the agent
 * @returns
 */
export const createMcpServer = (
  requinUrl: string,
  requinApiKey: string,
): RequinMcpServerInstance => {
  return new createMcpConnect(requinUrl, requinApiKey);
};
